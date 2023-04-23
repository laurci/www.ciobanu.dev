import clsx from "clsx";
import classes from "./cube.module.css";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Cube(props: Props) {
  return (
    <div className={clsx(classes.root, props.className)} style={props.style}>
      <div className={clsx(classes.front)}>{props.children}</div>
      <div className={clsx(classes.side)}></div>
      <div className={clsx(classes.bottom)}></div>
    </div>
  );
}

export function CubeLeft(props: Props) {
  return (
    <div className={clsx(classes.root, props.className)} style={props.style}>
      <div className={clsx(classes.frontLeft, "h-full")}>{props.children}</div>
      <div className={clsx(classes.sideLeft)}/>
      <div className={clsx(classes.bottomLeft)}/>
    </div>
  );
}
