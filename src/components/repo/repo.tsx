import { Details } from "@/lib/details";
import { RepoLanguagesBar, RepoLanguagesList } from "./repo-languages";
import { CubeLeft } from "../cube";
import clsx from "clsx";
import { PropsWithChildren } from "react";

interface RepositoryData {
  nameWithOwner: string;
  name: string;
  languages: LanguageStats[];
  details: Details;
}

interface LanguageStats {
  name: string;
  color: string;
  usage: number;
}

interface Props {
  repo: RepositoryData;
}

export function Repo(props: Props) {
  return (
    <div
      className="bg-light-grey border-dark border-2 rounded-md p-5"
    //   style={{ display: "flex", flexDirection: "column" }}
    >
      <p className="text-2xl uppercase font-bold text-blue-dark">
        {props.repo.name}
      </p>
      <RepoTags className="mt-3" tags={props.repo.details.tags} />
      <div
        className="mt-2 text-dark"
        // className="mt-2 text-dark repo-text"
        dangerouslySetInnerHTML={{ __html: props.repo.details.description }}
      />
      <RepoLanguagesBar className="mt-9" languages={props.repo.languages} />
      <RepoLanguagesList className="mt-7" languages={props.repo.languages} />

      <div className="mt-auto" />
      <RepoLink name={props.repo.nameWithOwner} className="mt-4" />
    </div>
  );
}

function RepoLink({ name, className }: { name: string; className?: string }) {
  return (
    <>
      <a
        className={clsx("text-dark font-bold underline block", className)}
        href={`https://github.com/${name}`}
        target="_blank"
      >
        See more
      </a>
    </>
  );
}

function RepoTag(props: PropsWithChildren) {
  return (
    <div
      className="rounded-3xl text-turquoise-dark py-2 px-4 mr-3 mt-3"
      style={{ background: "rgba(86, 177, 182, 0.2)" }}
    >
      {props.children}
    </div>
  );
}

interface RepoTagsProps {
  className?: string;
  tags?: string[];
  style?: React.CSSProperties;
}

function RepoTags(props: RepoTagsProps) {
  if (props.tags == null || props.tags.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx("flex flex-row flex-wrap", props.className)}
      style={props.style}
    >
      {props.tags.map((tag, index) => (
        <RepoTag key={index}>{tag}</RepoTag>
      ))}
    </div>
  );
}

export function CubeRepo(props: Props) {
  return (
    <CubeLeft
      className={clsx(
        "row-span-2",
        props.repo.details.size === "big" && "col-span-2"
      )}
    >
      <div className="p-5 h-full flex flex-col">
        <p className="text-2xl uppercase font-bold text-blue-dark">
          {props.repo.name}
        </p>
        <RepoTags tags={props.repo.details.tags} />
        <div
          // className="repo-text mt-3 text-dark"
          className="mt-3 text-dark"
          dangerouslySetInnerHTML={{ __html: props.repo.details.description }}
        />
        <RepoLanguagesBar className="mt-9" languages={props.repo.languages} />
        <RepoLanguagesList className="mt-7" languages={props.repo.languages} />

        <div className="mt-auto" />
        <RepoLink name={props.repo.nameWithOwner} className="mt-4" />
      </div>
    </CubeLeft>
  );
}
