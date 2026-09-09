import type { InputHTMLAttributes } from "react";
export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "size"> {
  value: string;
  onChange: (value: string, event?: React.SyntheticEvent) => void;
  /** Enter */
  onSearch?: (value: string) => void;
  placeholder?: string;
  /** `/` 키로 포커스. 기본 true */
  shortcut?: boolean;
  size?: "sm" | "md";
  /** flex=부모 폭(기본), fixed=width, auto=내용 크기 */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
}
export declare function SearchField(props: SearchFieldProps): JSX.Element;
