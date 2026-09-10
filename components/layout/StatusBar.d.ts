import type { HTMLAttributes, ReactNode } from "react";
export interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  live?: { label: string };
  /** 왼쪽 상태 항목 */
  items?: ReactNode[];
  /** 오른쪽 메타 항목 */
  right?: ReactNode[];
}
export declare function StatusBar(props: StatusBarProps): ReactNode;
