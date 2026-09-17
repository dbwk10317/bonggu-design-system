import type { HTMLAttributes, ReactNode } from "react";
/**
 * Big-number tile. Numbers render in mono with ko-KR grouping, strings as is. Updates instantly by default.
 * Missing (null/undefined/NaN) shows "수집 안 됨" without mono and without the unit.
 */
export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** null when missing; shown as "수집 안 됨" */
  value: number | string | null;
  unit?: string;
  /** Fraction digits */
  digits?: number;
  /** Change; a number gets its sign and color automatically */
  delta?: number | string;
  deltaLabel?: string;
  /** Recent trend */
  spark?: (number | null)[];
  /** Secondary line under the value (Tags, last update, etc.) */
  detail?: ReactNode;
  /** Status pill next to the label */
  pill?: { tone: "ok" | "warn" | "crit" | "info" | "off"; text: string };
  /** Phosphor icon before the label */
  icon?: string;
  tone?: 1 | 2 | 3 | 4 | 5 | 6;
  /** No card border (several tiles inside one Panel) */
  flat?: boolean;
  /** One-time count-up on entry. Default false: live numbers change instantly */
  animate?: boolean;
  /** flex = parent width (default), fixed = width/height */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
}
export declare function StatTile(props: StatTileProps): ReactNode;
