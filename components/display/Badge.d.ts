import type { HTMLAttributes, ReactNode } from "react";
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number;
  /** 초과 시 "99+" */
  max?: number;
  tone?: "neutral" | "accent" | "ok" | "warn" | "crit";
  /** 숫자 없는 점 */
  dot?: boolean;
  /** 감싸면 오른쪽 위에 붙음 */
  children?: ReactNode;
}
export declare function Badge(props: BadgeProps): ReactNode;
