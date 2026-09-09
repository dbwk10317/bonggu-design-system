import type { HTMLAttributes, ReactNode } from "react";
export interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "neutral" | "ok" | "warn" | "crit" | "info";
  icon?: string;
  children?: ReactNode;
}
export declare function InlineMessage(props: InlineMessageProps): JSX.Element;
