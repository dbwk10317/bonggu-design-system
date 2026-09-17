/** @responsive */
import type { HTMLAttributes, ReactNode } from "react";
export interface LogLine { /** Stable identity for streaming/ring-buffer lines. */ id?: string; level?: "info" | "warn" | "error" | "debug" | "ok"; time?: string; text: string }
export interface LogViewerProps extends HTMLAttributes<HTMLDivElement> {
  lines: (string | LogLine)[];
  /** Keep scrolled to the bottom as lines arrive. Default true */
  follow?: boolean;
  /** Search, level filtering, result navigation and follow controls. Default false. */
  searchable?: boolean;
  wrap?: boolean;
  numbers?: boolean;
  /** flex = parent width (default), fixed = width/height */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  /** Default 240 */
  height?: number | string;
}
export declare function LogViewer(props: LogViewerProps): ReactNode;
