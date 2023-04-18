import { Details } from "@/lib/details";
import { parse as parseYaml } from "yaml";
import { remark } from "remark";
import html from "remark-html";

interface LanguageStats {
  name: string;
  color: string;
  usage: number;
}

interface RepositoryData {
  nameWithOwner: string;
  name: string;
  languages: LanguageStats[];
  details: Details;
}

interface HomeProps {
  repositories: RepositoryData[];
}

export default function Home(props: HomeProps) {
  return (
    <>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </>
  );
}

function roundToDigits(value: number) {
  return parseFloat(Math.round(value * 10) + ".0") / 10;
}

async function getLanguagesUsage(
  repo: string,
  languages: { name: string; color: string }[]
): Promise<LanguageStats[]> {
  const stats: LanguageStats[] = [];
  let totalUsage = 0;
  const response = await fetch(`https://api.github.com/repos/${repo}/languages`)
    .then((res) => res.json())
    .then((res) => res as Record<string, number>);
  const totalLines = Object.values(response).reduce((a, b) => a + b, 0);
  const percentages = Object.keys(response)
    .map((key) => ({
      name: key,
      value: roundToDigits((response[key] * 100) / totalLines),
    }))
    .sort((a, b) => b.value - a.value);
  for (const percentage of percentages) {
    stats.push({
      name: percentage.name,
      usage: percentage.value,
      color:
        languages.find((x) => x.name == percentage.name)?.color ?? "#ffc370",
    });
    totalUsage += percentage.value;
    if (totalUsage > 99) {
      break;
    }
  }
  if (totalUsage < 100) {
    stats.push({
      name: "Other",
      usage: roundToDigits(100 - totalUsage),
      color: "#ededed",
    });
  }
  return stats;
}

async function getShowcaseRepositories(cursor?: string): Promise<
  {
    name: string;
    nameWithOwner: string;
    description: string;
    defaultBranch: string;
    languages: { name: string; color: string }[];
  }[]
> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: "bearer " + process.env.GITHUB_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
query { 
  viewer { 
    repositories(first: 100, privacy: PUBLIC${cursor ? ', after: "' + cursor + '"' : ""
        }) {
      pageInfo {
        hasNextPage,
        endCursor
      },
      totalCount,
      nodes {
        name,
        nameWithOwner,
        description,
        defaultBranchRef {
          name
        },
        languages(first: 100) {
          nodes {
            id,
            name,
            color
          }
        },
        branchProtectionRules(first: 100) {
          nodes {
            pattern
          }
        }
      }
    }
  }
}
        `,
    }),
  })
    .then((res) => res.json())
    .then(
      (res) =>
        res as {
          data: {
            viewer: {
              repositories: {
                pageInfo: { hasNextPage: boolean; endCursor: string };
                totalCount: number;
                nodes: {
                  name: string;
                  nameWithOwner: string;
                  description: string;
                  defaultBranchRef: {
                    name: string;
                  };
                  languages: {
                    nodes: {
                      id: string;
                      name: string;
                      color: string;
                    }[];
                  };
                  branchProtectionRules: {
                    nodes: {
                      pattern: string;
                    }[];
                  };
                }[];
              };
            };
          };
        }
    );

  const repositories = response.data.viewer.repositories.nodes
    .filter((repo) =>
      repo.branchProtectionRules.nodes.find(
        (x) => x.pattern === "ciobanu.dev/v1/showcase"
      )
    )
    .map((x) => ({
      name: x.name,
      nameWithOwner: x.nameWithOwner,
      description: x.description,
      defaultBranch: x.defaultBranchRef.name,
      languages: x.languages.nodes,
    }));

  if (response.data.viewer.repositories.pageInfo.hasNextPage) {
    return [
      ...repositories,
      ...(await getShowcaseRepositories(
        response.data.viewer.repositories.pageInfo.endCursor
      )),
    ];
  }

  return repositories;
}

async function extractDetails(
  repo: string,
  ref: string
): Promise<Details | undefined> {
  try {
    const detailsText = await fetch(
      `https://raw.githubusercontent.com/${repo}/${ref}/.showcase.yml`
    ).then((res) => {
      if (res.status !== 200) return undefined;
      return res.text();
    });
    if (!detailsText) return undefined;

    const details = parseYaml(detailsText) as Details;

    return details;
  } catch (ex) {
    return undefined;
  }
}

const renderer = remark().use(html);

async function renderDetailsDescription(details: Details): Promise<Details> {
  const result = await renderer.process(details.description);
  details.description = result.toString();
  return details;
}

export async function getStaticProps() {
  const repositories: RepositoryData[] = [];

  const rawRepositories = await getShowcaseRepositories();

  for (const rawRepo of rawRepositories) {
    const languageStats = await getLanguagesUsage(
      rawRepo.nameWithOwner,
      rawRepo.languages
    );

    let details = await extractDetails(
      rawRepo.nameWithOwner,
      rawRepo.defaultBranch
    );

    if (!details) {
      details = {
        size: "small",
        description: rawRepo.description,
      };
    }

    details = await renderDetailsDescription(details);

    repositories.push({
      name: rawRepo.name,
      nameWithOwner: rawRepo.nameWithOwner,
      details,
      languages: languageStats,
    });
  }

  return {
    props: {
      repositories,
    } satisfies HomeProps,
    revalidate: 60 * 60 * 1000, // 60 minutes
  };
}
