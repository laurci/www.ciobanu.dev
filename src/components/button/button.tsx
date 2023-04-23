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
          "cursor-pointer text-center text-base lg:text-xl border-2 rounded-xl select-none",
          classes.root,
          className
        )}
      >
        {wrappedChildren}
      </div>
    </>
  );
}
