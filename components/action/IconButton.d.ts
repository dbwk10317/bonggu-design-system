import type { ButtonHTMLAttributes, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
/** Icon-only button. aria-label is required. */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  /** Phosphor icon name; children may be passed instead. */
  icon?: string;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "ghost" | "danger";
  /** Count badge at the top right when > 0 */
  badge?: number;
  children?: ReactNode;
}
export declare const IconButton: ForwardRefExoticComponent<IconButtonProps & RefAttributes<HTMLButtonElement>>;
