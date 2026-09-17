/** @responsive */
/** @visualization */
import type { ReactNode } from "react";
/** Categorical 1–8, fixed semantic pairs "rx"|"tx"|"used"|"reserved"|"free", meter thresholds "ok"|"warn"|"crit" (radial, BarList) */
export type ChartTone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "rx" | "tx" | "used" | "reserved" | "free" | "ok" | "warn" | "crit";
export interface ChartSeries {
  key?: string; label: ReactNode; tone?: ChartTone;
  /** null is an uncollected interval (breaks the line) */
  values: (number | null)[];
  /** line/area stroke-dasharray. Omitted: with 3+ series cycles solid · "6 4" · "2 4" · "8 3 2 3". false: always solid */
  dash?: string | false;
}
export interface ChartSegment { label: ReactNode; value: number | null; tone?: ChartTone }
export interface ChartEvent { id: string; value: number; label: string }
export interface ChartThreshold { value: number; label?: string; tone?: "warn" | "crit" | "info" | "ok" }
interface ChartBase {
  /** flex = parent width (default), fixed/auto = explicit width; height sizes the plot viewport */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  /** Plot viewport height (px); external readout, annotations and legend follow below. Defaults: line/area/bar 200, pie 180, radial 110, radar 260, histogram 180 */
  height?: number;
  /** What the chart shows. Defaults to "차트". The hidden data table is always linked via aria-describedby */
  "aria-label"?: string;
  valueFormatter?: (v: number) => string;
  /** Text shown when there is no data. Default "수집 안 됨" */
  emptyText?: string;
  showLegend?: boolean;
  /** One-time draw-on animation on entry. Default true (false when live) */
  animate?: boolean;
  /** Streaming chart: disables the entry animation (values change instantly, no transition) */
  live?: boolean;
  /** true keeps drawing the last received props snapshot; switching back to false catches up with the latest props */
  paused?: boolean;
  className?: string;
}
export interface CartesianChartProps extends ChartBase {
  kind: "line" | "area" | "bar";
  labels: string[];
  /** Strictly increasing finite data coordinates, one per label. Required for linked cursor, events and zoom. */
  xValues?: number[];
  /** Selected data coordinate, independent of display scale. */
  hoverValue?: number | null;
  onHoverValueChange?: (value: number | null) => void;
  zoomable?: boolean;
  /** Controlled displayed domain. null resets to the full domain. */
  range?: [number, number] | null;
  onRangeChange?: (range: [number, number] | null) => void;
  events?: ChartEvent[];
  /** Series with different units do not share one chart */
  series: ChartSeries[];
  xTicks?: "auto" | "ends" | "none";
  /** Threshold lines (warn/crit) */
  thresholds?: ChartThreshold[];
  /** bar only: positives and negatives each stack from 0. null is excluded from bars and totals */
  stacked?: boolean;
  yMin?: number; yMax?: number;
}
export interface PieChartProps extends ChartBase { kind: "pie"; segments: ChartSegment[]; /** Caption under the center total */ caption?: ReactNode }
export interface RadialChartProps extends ChartBase { kind: "radial"; /** 0~1 */ value: number | null; /** State text under the center value (paired with the color) */ label?: ReactNode; tone?: ChartTone }
export interface RadarChartProps extends ChartBase { kind: "radar"; axes: string[]; series: ChartSeries[]; max?: number }
/** Distribution (latency p50/p95). samples are raw; bins are automatic (√n) or explicit. percentiles are 0–1 ratios (e.g. [0.5, 0.95]) */
export interface HistogramChartProps extends ChartBase { kind: "histogram"; samples: (number | null)[]; bins?: number; tone?: ChartTone; percentiles?: number[]; unit?: string }
export type ChartProps = CartesianChartProps | PieChartProps | RadialChartProps | RadarChartProps | HistogramChartProps;
/**
 * Single chart component. kind selects the representation; the chrome (grid, axes, legend, tooltip) is shared.
 */
export declare function Chart(props: ChartProps): ReactNode;
