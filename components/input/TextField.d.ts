import type { ForwardRefExoticComponent, InputHTMLAttributes, ReactNode, RefAttributes } from "react";
/**
 * Single-line text input. Use inside Field.
 */
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: "sm" | "md";
  /** flex = parent width (default), fixed = width, auto = content size */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  /** Leading icon (Phosphor) */
  icon?: string;
  prefix?: ReactNode;
  /** Units and the like */
  suffix?: ReactNode;
  /** mono for numeric or code input */
  mono?: boolean;
  invalid?: boolean;
}
export declare const TextField: ForwardRefExoticComponent<TextFieldProps & RefAttributes<HTMLInputElement>>;
