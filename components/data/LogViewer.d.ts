import type { HTMLAttributes } from "react";
export interface LogLine { level?: "info" | "warn" | "error" | "debug" | "ok"; time?: string; text: string }
export interface LogViewerProps extends HTMLAttributes<HTMLDivElement> {
  lines: (string | LogLine)[];
  /** 새 줄에 따라 바닥 스크롤. 기본 true */
  follow?: boolean;
  wrap?: boolean;
  numbers?: boolean;
  /** flex=부모 폭(기본), fixed=width·height */
  fit?: "flex" | "fixed";
  width?: number | string;
  /** 기본 240 */
  height?: number | string;
}
export declare function LogViewer(props: LogViewerProps): JSX.Element;
