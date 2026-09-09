import type { HTMLAttributes, ReactNode } from "react";
export type StepStatus = "done" | "current" | "error" | "todo";
export interface StepItem { label: ReactNode; detail?: ReactNode; status?: StepStatus }
/** 단계 표시. 등록 작업 9단계, 학습 stage(prepare → train → eval). */
export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  steps: StepItem[];
  /** 현재 단계 인덱스. 각 step의 status가 우선한다 */
  current?: number;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md";
  fit?: "flex" | "fixed";
  width?: number | string;
  "aria-label"?: string;
}
export declare function Stepper(props: StepperProps): JSX.Element;
