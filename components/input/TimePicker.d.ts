import type { HTMLAttributes, ReactNode } from "react";
export interface TimePickerProps {
  /** "HH:MM" 24시간 */
  value?: string;
  onChange?: (value: string) => void;
  /** 분 단위(기본 5) */
  step?: number;
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  disabled?: boolean;
  className?: string;
  style?: any;
}
export declare function TimePicker(props: TimePickerProps): ReactNode;
