import type { HTMLAttributes, ReactNode } from "react";
export interface BarListItem { key?: string; name: React.ReactNode; /** null·undefined·NaN이면 막대 0 + "수집 안 됨" */ value: number | null; tone?: 1 | 2 | 3 | 4 | 5 | 6 }
export interface BarListProps extends HTMLAttributes<HTMLDivElement> {
  items: BarListItem[];
  /** 생략 시 최대값 */
  max?: number;
  valueFormatter?: (v: number) => string;
  /** 임계를 넘으면 warn/crit 색 */
  thresholds?: { warn: number; crit: number };
  tone?: 1 | 2 | 3 | 4 | 5 | 6;
  thick?: boolean;
  /** flex=부모 폭(기본), fixed=width·height */
  fit?: "flex" | "fixed";
  width?: number | string;
}
export declare function BarList(props: BarListProps): ReactNode;
