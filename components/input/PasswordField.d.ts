import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { InputHTMLAttributes } from "react";
export interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "value"> {
  /** Controlled value. Strength calculation accepts strings only */
  value?: string;
  /** Strength meter + text (new-password fields only) */
  strength?: boolean;
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
}
export declare function passwordStrength(s: string): 0 | 1 | 2 | 3 | 4;
export declare const PasswordField: ForwardRefExoticComponent<PasswordFieldProps & RefAttributes<HTMLInputElement>>;
