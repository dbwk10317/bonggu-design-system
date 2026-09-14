import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
export interface DatePickerProps {
  /** "YYYY-MM-DD". 외부 변경 및 다시 열 때 표시 월을 선택 월에 맞춘다. */
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  disabled?: boolean;
  className?: string;
  style?: any;
}
export declare const DatePicker: ForwardRefExoticComponent<DatePickerProps & RefAttributes<HTMLButtonElement>>;
