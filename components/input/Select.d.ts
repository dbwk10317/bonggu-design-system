import type { ForwardRefExoticComponent, RefAttributes, SelectHTMLAttributes } from "react";
export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  placeholder?: string;
  /** Control size. Default md */
  size?: "sm" | "md";
  /** flex = parent width (default), fixed = width, auto = content size */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  invalid?: boolean;
}
export declare const Select: ForwardRefExoticComponent<SelectProps & RefAttributes<HTMLSelectElement>>;
