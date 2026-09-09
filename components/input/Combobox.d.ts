import type { HTMLAttributes, ReactNode } from "react";
export interface ComboOption { value: string; label: string; detail?: ReactNode; disabled?: boolean }
/** 검색 가능한 단일 선택. 모델·revision·사용자처럼 목록이 자라는 곳. 6개 미만이면 Select. */
export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: ComboOption[];
  value: string | null;
  onChange: (value: string | null, option: ComboOption | null) => void;
  placeholder?: string;
  emptyText?: ReactNode;
  size?: "sm" | "md";
  fit?: "flex" | "fixed";
  width?: number | string;
  disabled?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  "aria-label"?: string;
}
export declare function Combobox(props: ComboboxProps): JSX.Element;
