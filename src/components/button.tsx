import { CSSProperties, ComponentProps, useMemo } from "react";
import clsx from "clsx";
import classes from "./button.module.css";

interface Props extends ComponentProps<"div"> {
  className?: string;
  shadowClassName?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export function Button(props: Props) {
  const { className, shadowClassName, children, ...rest } = props;
  const wrappedChildren = typeof children === "string" ? <p>{children}</p> : children;

  return (
    <>
      <div
        {...rest}
        className={clsx(
          "cursor-pointer text-xl border-2 rounded-xl font-bold relative select-none",
          classes.root,
          className
        )}
      >
        {wrappedChildren}
        <div
          className={clsx(
            "absolute w-full h-full top-2 left-2 rounded-xl -z-10",
            shadowClassName
          )}
        />
      </div>
    </>
  );
}
