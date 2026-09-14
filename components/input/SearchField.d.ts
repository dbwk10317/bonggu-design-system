import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "size"> {
  value: string;
  onChange: (value: string, event?: React.SyntheticEvent) => void;
  /** Enter */
  onSearch?: (value: string) => void;
  placeholder?: string;
  /** `/` key focuses the field. Default true */
  shortcut?: boolean;
  size?: "sm" | "md";
  /** flex = parent width (default), fixed = width, auto = content size */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
}
export declare const SearchField: ForwardRefExoticComponent<SearchFieldProps & RefAttributes<HTMLInputElement>>;
