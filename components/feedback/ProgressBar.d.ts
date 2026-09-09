import type { HTMLAttributes, ReactNode } from "react";
/** 선형 진행 바. 업로드·등록 작업처럼 시작~끝이 있는 진행에. 비율 게이지(radial)와 구분한다. */
export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** 0~1. null/undefined면 비결정형 */
  value?: number | null;
  label?: ReactNode;
  /** 바 아래 보조 줄(예: "3/9 청크 · 42 MiB/s") */
  detail?: ReactNode;
  tone?: "accent" | "ok" | "warn" | "crit";
  size?: "sm" | "md";
  showValue?: boolean;
  valueFormatter?: (v: number) => string;
  fit?: "flex" | "fixed";
  width?: number | string;
  "aria-label"?: string;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
