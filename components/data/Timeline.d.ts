/** @visualization */
import type { HTMLAttributes, ReactNode } from "react";
export interface TimelineItem { id?: string; /** Timestamp or date-time; wraps within its content-sized column. */ time: ReactNode; title: ReactNode; detail?: ReactNode; tone?: "ok" | "warn" | "crit" | "info" | "off" | "accent"; icon?: string }
/** Time-ordered event list: recent ops changes, lease transitions, training stage history. */
export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  items: TimelineItem[];
  dense?: boolean;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  "aria-label"?: string;
}
export declare function Timeline(props: TimelineProps): ReactNode;
