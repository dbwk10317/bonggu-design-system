import type { HTMLAttributes, ReactNode } from "react";
export type Tone = "ok" | "warn" | "crit" | "info" | "off" | "accent";
/**
 * Status pill. Text is required; color alone never conveys state (see RULE.md "설계 원칙").
 */
export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  /** Pulse the dot only while updating live */
  pulse?: boolean;
  dot?: boolean;
  outline?: boolean;
  children: ReactNode;
}
export declare function StatusPill(props: StatusPillProps): ReactNode;
