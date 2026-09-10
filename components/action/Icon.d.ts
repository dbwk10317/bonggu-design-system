import type { HTMLAttributes, ReactNode } from "react";
/** Phosphor Bold 아이콘 래퍼. */
export interface IconProps extends HTMLAttributes<HTMLElement> {
  /** Phosphor 아이콘 이름(kebab-case) 예: "bell", "gear-six", "pulse" */
  name: string;
  /** px. 기본 16 */
  size?: number;
  /** 단독 의미가 있을 때만. 없으면 aria-hidden */
  label?: string;
}
export declare function Icon(props: IconProps): ReactNode;
