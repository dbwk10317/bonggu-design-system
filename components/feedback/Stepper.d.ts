import type { HTMLAttributes, ReactNode } from "react";
export type StepStatus = "done" | "current" | "error" | "todo";
export interface StepItem { label: ReactNode; detail?: ReactNode; status?: StepStatus }
/** Step indicator: registration steps, training stages (prepare → train → eval). */
export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  steps: StepItem[];
  /** Current step index; an explicit step status takes precedence */
  current?: number;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md";
  fit?: "flex" | "fixed";
  width?: number | string;
  "aria-label"?: string;
}
export declare function Stepper(props: StepperProps): ReactNode;
