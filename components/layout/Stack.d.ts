import type { HTMLAttributes, ReactNode } from "react";
import type { ElementType } from "react";
/** Vertical stack */
export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** --sp step (1–10) or CSS length. Default 4 (16px) */
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
  as?: ElementType;
  children?: ReactNode;
}
export declare function Stack(props: StackProps): ReactNode;
