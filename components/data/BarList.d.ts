/** @visualization */
import type { HTMLAttributes, ReactNode } from "react";
export interface BarListItem { key?: string; name: React.ReactNode; /** Missing (null/undefined/NaN) draws a zero bar plus "수집 안 됨" */ value: number | null; tone?: 1 | 2 | 3 | 4 | 5 | 6 }
export interface BarListProps extends HTMLAttributes<HTMLDivElement> {
  items: BarListItem[];
  /** Defaults to the largest item value */
  max?: number;
  valueFormatter?: (v: number) => string;
  /** Bars at or above these switch to warn/crit color */
  thresholds?: { warn: number; crit: number };
  tone?: 1 | 2 | 3 | 4 | 5 | 6;
  thick?: boolean;
  /** flex = parent width (default), fixed = width/height */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
}
export declare function BarList(props: BarListProps): ReactNode;
