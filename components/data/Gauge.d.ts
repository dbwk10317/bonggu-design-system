/** @visualization */
import type { HTMLAttributes, ReactNode } from "react";
export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  /** Missing (null/undefined/NaN) shows "수집 안 됨" with tone off */
  value: number | null;
  max?: number;
  label?: ReactNode;
  unit?: string;
  valueFormatter?: (v: number) => string;
  /** Thresholds as ratios (0–1). Default 0.7/0.9 */
  thresholds?: { warn: number; crit: number };
  /** Overrides the automatic tone */
  tone?: "ok" | "warn" | "crit" | "accent" | "off";
  ticks?: boolean;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  /** Total height including the readout and ticks; the plot uses remaining space. */
  height?: number | string;
}
export declare function Gauge(props: GaugeProps): ReactNode;
