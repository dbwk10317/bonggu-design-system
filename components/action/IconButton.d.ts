import type { ButtonHTMLAttributes, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
/** 아이콘 전용 버튼. aria-label 필수. */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  /** Phosphor 아이콘 이름. children으로 직접 넘겨도 된다. */
  icon?: string;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "ghost" | "danger";
  /** 0보다 크면 우상단 카운트 배지 */
  badge?: number;
  children?: ReactNode;
}
export declare const IconButton: ForwardRefExoticComponent<IconButtonProps & RefAttributes<HTMLButtonElement>>;
