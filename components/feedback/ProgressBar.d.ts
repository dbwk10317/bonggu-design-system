import type { HTMLAttributes, ReactNode } from "react";
/** Linear progress bar for work with a start and an end (uploads, registration). Not a ratio gauge (radial). */
export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** 0–1; null/undefined means indeterminate */
  value?: number | null;
  label?: ReactNode;
  /** Secondary line under the bar (e.g. "3/9 청크 · 42 MiB/s") */
  detail?: ReactNode;
  tone?: "accent" | "ok" | "warn" | "crit";
  size?: "sm" | "md";
  showValue?: boolean;
  valueFormatter?: (v: number) => string;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  "aria-label"?: string;
}
export declare function ProgressBar(props: ProgressBarProps): ReactNode;
