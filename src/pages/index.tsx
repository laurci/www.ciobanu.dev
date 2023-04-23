import { Details } from "@/lib/details";
import { parse as parseYaml } from "yaml";
import { remark } from "remark";
import html from "remark-html";
import { Button } from "@/components/button";
import { Cube } from "@/components/cube";
import curlyArrow from "../assets/arrow-curly.svg";
import skills from "../assets/skills.svg";
import { RepoLanguagesBar } from "@/components/repo/repo-languages";
import { CubeRepo, Repo } from "@/components/repo/repo";
import bgFrame from "../assets/bg-frame.svg";
import footerScratch from "../assets/footer-scratch.svg";
import coderImg from "../assets/coder.svg";
import redMarker from "../assets/red-marker.svg";

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
  console.log(props.repositories);
  return (
    <>
      <section className="flex flex-col">
        <div className="flex flex-col max-w-7xl mx-auto">
          <h1 className="text-center font-semibold text-7xl mt-40 text-blue-dark">
            Hello there! I'm Laur.
          </h1>
          <p className="text-center font-medium text-xl mt-6 text-dark">
            I build some scalable server-side applications and here is my code
            playground.
            <br /> Check out some of my work or get in touch.
          </p>

          <div className="flex flex-row ml-auto mr-auto mt-10">
            <Button
              className="bg-turquoise text-teal border-teal"
              shadowClassName="bg-teal"
            >
              <a className="text-white" href="">
                See my projects
              </a>
            </Button>

            <Button
              className="bg-lighter border-turquoise text-turquoise ml-10"
              shadowClassName="bg-turquoise"
            >
              Contact me
            </Button>
          </div>

          <img
            className="mx-auto mt-6"
            src={coderImg.src}
            width={coderImg.width}
            height={coderImg.height}
            alt=""
          />

          <div className="mt-20 mx-20">
            <Cube>
              <div className="flex flex-row p-12 justify-between">
                <div>
                  <p className="text-xl text-white font-bold">
                    CODE CHRONICLES
                  </p>
                  <p className="text-white text-sm mt-4">
                    Looking for a fresh perspective on the tech industry? Check
                    out my blog, where I share insights, tips, and tricks for
                    developers of all levels.
                  </p>
                </div>
                <img
                  className="mx-10 my-auto"
                  src={curlyArrow.src}
                  width={curlyArrow.width}
                  height={curlyArrow.height}
                  alt=""
                />
                <Button
                  className="bg-purple text-white my-auto"
                  shadowClassName="bg-white"
                >
                  <a href="">Read more</a>
                </Button>
              </div>
            </Cube>
          </div>

          <img
            className="select-none"
            src={skills.src}
            width={skills.width}
            height={skills.height}
            alt="My skills"
          />

          <div className="mx-auto relative">
            <img
              className="absolute -top-3 -right-10 w-full px-8 z-0"
              src={redMarker.src}
              width={redMarker.width}
              height={redMarker.height}
              alt=""
            />
            <p className="text-blue-dark text-5xl mb-6 relative">My projects</p>
          </div>

          <p className="text-center text-dark text-lg max-w-2xl mx-auto mb-16">
            Buckle up and get ready to take a ride through the coding projects
            that I poured my heart and soul into...and maybe some coffee too.
          </p>

          <div className="grid mx-10 mb-20 grid-cols-3 gap-x-10 gap-y-16">
            {props.repositories.map((repo, index) =>
              repo.details.size === "small" ? (
                <Repo key={index} repo={repo} />
              ) : (
                <CubeRepo key={index} repo={repo} />
              )
            )}
          </div>

          <div className="flex flex-col mb-40">
            <div className="relative mx-auto px-10">
              <p className="text-center text-4xl font-normal text-blue-dark">
                Let's Talk.
              </p>
              <img
                className="absolute m-auto top-0 bottom-0 left-0 right-0"
                src={footerScratch.src}
                alt=""
              />
            </div>

            <p className="text-center text-4xl font-bold text-blue-dark mt-3">
              LETS'WRITE SOME CODE.
            </p>

            <p className="text-center text-lg text-dark mt-4">
              Get in touch with me on:
            </p>

            <div className="flex flex-row justify-center mt-6">
              <Button className="border-yellow text-yellow bg-lighter">
                <a className="text-blue-dark" href="">
                  LinkedIn
                </a>
              </Button>

              <p className="mx-6 my-auto text-dark text-lg">or</p>

              <Button className="border-orange text-orange bg-lighter">
                <a className="text-blue-dark" href="">
                  Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
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
  const response = await fetch(
    `https://api.github.com/repos/${repo}/languages`,
    {
      headers: {
        Authorization: "bearer " + process.env.GITHUB_TOKEN,
        "Content-Type": "application/json",
      },
    }
  )
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
      color: "#FF5A44",
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
    repositories(first: 100, privacy: PUBLIC${
      cursor ? ', after: "' + cursor + '"' : ""
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

  return [...repositories, ...repositories, ...repositories, ...repositories];
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
