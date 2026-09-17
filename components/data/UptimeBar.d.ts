/** @visualization */
import type { HTMLAttributes, ReactNode } from "react";
export interface UptimeSegment { status: "ok" | "warn" | "crit" | "off"; label?: string; }
export interface UptimeBarProps extends HTMLAttributes<HTMLDivElement> {
  name?: ReactNode;
  /** Availability = (ok+warn)/(ok+warn+crit); off is excluded from the denominator, and no collected cells means missing. Cells share the container width equally */
  segments: UptimeSegment[];
  /** Labels at the left and right ends */
  start?: ReactNode;
  end?: ReactNode;
  height?: number;
  /** Overrides with a precomputed availability (%) */
  uptime?: number;
}
export declare function UptimeBar(props: UptimeBarProps): ReactNode;
