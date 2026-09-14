import type { HTMLAttributes, ReactNode } from "react";
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number;
  /** Above this, renders "99+" */
  max?: number;
  tone?: "neutral" | "accent" | "ok" | "warn" | "crit";
  /** Dot without a number */
  dot?: boolean;
  /** When wrapping children, anchors to their top right */
  children?: ReactNode;
}
export declare function Badge(props: BadgeProps): ReactNode;
