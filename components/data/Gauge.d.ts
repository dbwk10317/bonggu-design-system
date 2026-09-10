import type { HTMLAttributes, ReactNode } from "react";
export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  /** null·undefined·NaN이면 "수집 안 됨"(tone off) */
  value: number | null;
  max?: number;
  label?: ReactNode;
  unit?: string;
  valueFormatter?: (v: number) => string;
  /** 비율(0~1) 기준 임계. 기본 0.7/0.9 */
  thresholds?: { warn: number; crit: number };
  /** 자동 톤을 덮어씀 */
  tone?: "ok" | "warn" | "crit" | "accent" | "off";
  ticks?: boolean;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  height?: number | string;
}
export declare function Gauge(props: GaugeProps): ReactNode;
