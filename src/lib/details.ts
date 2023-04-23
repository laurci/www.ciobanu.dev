export type Size = "big" | "medium" | "small";

export interface Details {
  name?: string;
  description: string;
  tags?: string[];
  size: Size;
}
