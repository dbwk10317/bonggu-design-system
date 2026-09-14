import type { HTMLAttributes, ReactNode } from "react";
export interface LegendItem {
  label: ReactNode;
  /** Swatch CSS color. Takes precedence over tone */
  color?: string;
  /** Series number 1–8 or a semantic key (rx, tx, used, reserved, free, ok, warn, crit) */
  tone?: import("./Chart.d.ts").ChartTone;
  value?: ReactNode;
  /** Line pattern (stroke-dasharray) when shape="line" */
  dash?: string;
  /** Per-item swatch shape. Defaults to the Legend's shape */
  shape?: "square" | "line" | "dot";
  hidden?: boolean;
}
// Since React 19 onToggle is also a DOM event (ToggleEvent) prop with a different signature, so it is omitted from the inherited attributes.
export interface LegendProps extends Omit<HTMLAttributes<HTMLUListElement>, "onToggle"> {
  items: LegendItem[];
  /** Default "square" */
  shape?: "square" | "line" | "dot";
  vertical?: boolean;
  /** Small text, used for the legend inside Chart. Default false */
  compact?: boolean;
  /** When given, items become click toggles */
  onToggle?: (index: number, item: LegendItem) => void;
}
export declare function Legend(props: LegendProps): ReactNode;
