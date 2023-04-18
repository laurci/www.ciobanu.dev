export type Size = "big" | "small";

export interface Details {
  name?: string;
  description: string;
  tags?: string[];
  size: Size;
}
