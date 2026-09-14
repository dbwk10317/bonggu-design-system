import type { HTMLAttributes, ReactNode } from "react";
import type { ElementType } from "react";
/** Horizontal row */
export interface InlineProps extends HTMLAttributes<HTMLElement> {
  /** --sp step number or CSS length; defaults to --inline-gap */
  gap?: number | string;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
  /** Default true; false keeps a single line */
  wrap?: boolean;
  as?: ElementType;
  children?: ReactNode;
}
export declare function Inline(props: InlineProps): ReactNode;
