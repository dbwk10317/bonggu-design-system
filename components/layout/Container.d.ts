import type { HTMLAttributes, ReactNode } from "react";
/** Centered max-width container */
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** 760px wide (settings and form pages) */
  narrow?: boolean;
  /** Horizontal --page-pad padding */
  pad?: boolean;
  children?: ReactNode;
}
export declare function Container(props: ContainerProps): ReactNode;
