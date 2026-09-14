import type { HTMLAttributes, ReactNode } from "react";
/** Divider */
export interface DividerProps extends HTMLAttributes<HTMLElement> {
  vertical?: boolean;
  /** Centered label (e.g. "또는") */
  label?: ReactNode;
}
export declare function Divider(props: DividerProps): ReactNode;
