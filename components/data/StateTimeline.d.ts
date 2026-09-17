/** @responsive */
/** @visualization */
import type { HTMLAttributes, ReactNode } from "react";
export interface StateInterval { id: string; start: number; end: number; label: string; status: "ok" | "warn" | "crit" | "info" | "off" }
export interface StateTimelineRow { id: string; label: string; intervals: StateInterval[] }
export interface StateTimelineProps extends HTMLAttributes<HTMLDivElement> {
  rows: StateTimelineRow[]; from?: number; to?: number; formatTime?: (time: number) => string;
  fit?: "auto" | "flex" | "fixed"; width?: number | string; height?: number | string;
  "aria-label"?: string;
}
export declare function StateTimeline(props: StateTimelineProps): ReactNode;
