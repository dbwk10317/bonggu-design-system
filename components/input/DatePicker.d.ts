import type { HTMLAttributes, ReactNode } from "react";
export interface DatePickerProps {
  /** "YYYY-MM-DD" */
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
export declare function DatePicker(props: DatePickerProps): JSX.Element;
