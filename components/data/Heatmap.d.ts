/** @visualization */
import type { HTMLAttributes, ReactNode } from "react";
/** 2-D intensity grid (requests by hour × weekday, GPU usage patterns) on the --ramp-1~6 sequential ramp. */
export interface HeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  rows: ReactNode[];
  cols: ReactNode[];
  /** values[rowIndex][colIndex]; null = missing */
  values: (number | null)[][];
  valueFormatter?: (v: number) => string;
  rowLabel?: (r: ReactNode) => ReactNode;
  colLabel?: (c: ReactNode) => ReactNode;
  /** Minimum cell size in px (default 14). Cells grow with the width; smaller viewports scroll internally */
  cell?: number;
  gap?: number;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  "aria-label"?: string;
}
export declare function Heatmap(props: HeatmapProps): ReactNode;
