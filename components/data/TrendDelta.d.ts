import type { HTMLAttributes, ReactNode } from "react";
export interface TrendDeltaProps extends HTMLAttributes<HTMLSpanElement> {
  /** Change amount. Missing (null/undefined/NaN) shows "수집 안 됨" without an arrow */
  value: number | null;
  /** value is a ratio (0.12 → +12.0%) */
  percent?: boolean;
  /** Metrics where an increase is bad (latency, error rate) */
  inverse?: boolean;
  /** Reference such as "1시간 전 대비" */
  label?: ReactNode;
  precision?: number;
}
export declare function TrendDelta(props: TrendDeltaProps): ReactNode;
