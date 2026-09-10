import type { SelectHTMLAttributes } from "react";
export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md";
  /** flex=부모 폭(기본), fixed=width, auto=내용 크기 */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  invalid?: boolean;
}
export declare function Select(props: SelectProps): JSX.Element;
