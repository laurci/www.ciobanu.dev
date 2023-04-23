import clsx from "clsx";
import { CSSProperties } from "react";

interface LanguageStats {
  name: string;
  color: string;
  usage: number;
}

interface Props {
  className?: string;
  style?: CSSProperties;
  languages: LanguageStats[];
}

function RepoLanguageBarItem(
  props: LanguageStats & { isFirst: boolean; isLast: boolean }
) {
  return (
    <>
      <div
        className={clsx(
          props.isFirst && "rounded-tl-md rounded-bl-md",
          props.isLast && "rounded-tr-md rounded-br-md"
        )}
        style={{
          background: props.color,
          width: `${props.usage}%`,
          height: 14,
        }}
      ></div>
      {!props.isLast && (
        <div
          className="bg-grey mx-1 rounded-md"
          style={{ height: 20, width: 2, marginTop: -3 }}
        />
      )}
    </>
  );
}

export function RepoLanguagesBar(props: Props) {
  const filteredLanguages = props.languages.filter(language => language.usage > 1);

  return (
    <div className={clsx("flex flex-row", props.className)} style={props.style}>
      {filteredLanguages.map((language, index) => (
        <RepoLanguageBarItem
          {...language}
          isFirst={index === 0}
          isLast={index === filteredLanguages.length - 1}
          key={index}
        />
      ))}
    </div>
  );
}

function RepoLanguageListItem(props: LanguageStats) {
  return (
    <div className="flex flex-row items-center">
      <div
        className="rounded-md h-3 w-3"
        style={{
          background: props.color,
        }}
      ></div>
      <p className="ml-2 text-blue-dark">{props.name}</p>
      <p className="ml-2 text-dark opacity-50">{props.usage}%</p>
    </div>
  );
}

export function RepoLanguagesList(props: Props) {
  return (
    <div
      className={clsx(
        "flex flex-row gap-x-6 gap-y-3 flex-wrap",
        props.className
      )}
      style={props.style}
    >
      {props.languages.map((language, index) => (
        <RepoLanguageListItem {...language} key={index} />
      ))}
    </div>
  );
}
