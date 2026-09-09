import type { HTMLAttributes, ReactNode } from "react";
export interface UptimeSegment { status: "ok" | "warn" | "crit" | "off"; label?: string; }
export interface UptimeBarProps extends HTMLAttributes<HTMLDivElement> {
  name?: ReactNode;
  segments: UptimeSegment[];
  /** 왼쪽·오른쪽 끝 라벨 */
  start?: ReactNode;
  end?: ReactNode;
  height?: number;
  /** 직접 계산한 가용성(%)로 덮어씀 */
  uptime?: number;
}
export declare function UptimeBar(props: UptimeBarProps): JSX.Element;
