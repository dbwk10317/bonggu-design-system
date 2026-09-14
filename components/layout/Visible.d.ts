import type { HTMLAttributes, ReactNode } from "react";
/** Breakpoint visibility. sm 640 · md 768 · lg 1024 */
export interface VisibleProps {
  /** Visible only at this width and above */
  above?: "sm" | "md" | "lg";
  /** Visible only below this width */
  below?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}
export declare function Visible(props: VisibleProps): ReactNode;
