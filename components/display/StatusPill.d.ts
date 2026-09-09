import type { HTMLAttributes, ReactNode } from "react";
export type Tone = "ok" | "warn" | "crit" | "info" | "off" | "accent";
/**
 * 상태 pill. 텍스트 필수(색 단독 금지).
 */
export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  /** 실시간 갱신 중일 때만 점이 맥동 */
  pulse?: boolean;
  dot?: boolean;
  outline?: boolean;
  children: ReactNode;
}
export declare function StatusPill(props: StatusPillProps): JSX.Element;
