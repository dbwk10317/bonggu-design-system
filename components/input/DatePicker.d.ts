import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
export interface DatePickerProps {
  /** "YYYY-MM-DD". The displayed month follows this value on external change and on reopen. */
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
