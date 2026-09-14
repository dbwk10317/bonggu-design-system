import type { HTMLAttributes, ReactNode } from "react";
export interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  live?: { label: string };
  /** Status items on the left */
  items?: ReactNode[];
  /** Meta items on the right */
  right?: ReactNode[];
}
export declare function StatusBar(props: StatusBarProps): ReactNode;
