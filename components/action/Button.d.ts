import type { ButtonHTMLAttributes, ReactNode } from "react";
/**
 * 버튼. 확인 버튼 라벨은 동사("적용", "저장").
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** auto=내용 크기(기본), flex=부모 폭, fixed=width */
  fit?: "auto" | "flex" | "fixed";
  width?: number | string;
  /** Phosphor 아이콘 이름 */
  icon?: string;
  iconRight?: string;
  /** 진행 중: 스피너 + disabled */
  busy?: boolean;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
