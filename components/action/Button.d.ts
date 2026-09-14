import type { ButtonHTMLAttributes, ReactNode } from "react";
/**
 * Button. Confirm labels are verbs ("적용", "저장").
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** auto = content size (default), flex = parent width, fixed = width */
  fit?: "auto" | "flex" | "fixed";
  width?: number | string;
  /** Phosphor icon name */
  icon?: string;
  iconRight?: string;
  /** In progress: spinner + disabled */
  busy?: boolean;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}
export declare function Button(props: ButtonProps): ReactNode;
