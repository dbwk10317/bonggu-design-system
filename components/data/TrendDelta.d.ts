import type { HTMLAttributes, ReactNode } from "react";
export interface TrendDeltaProps extends HTMLAttributes<HTMLSpanElement> {
  /** 변화량. null·undefined·NaN이면 화살표 없이 "수집 안 됨" */
  value: number | null;
  /** value가 비율(0.12 → +12.0%) */
  percent?: boolean;
  /** 증가가 나쁜 지표(응답시간·오류율) */
  inverse?: boolean;
  /** "1시간 전 대비" 같은 기준 */
  label?: ReactNode;
  precision?: number;
}
export declare function TrendDelta(props: TrendDeltaProps): ReactNode;
