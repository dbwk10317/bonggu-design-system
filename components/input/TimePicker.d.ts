import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
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
export declare const TimePicker: ForwardRefExoticComponent<TimePickerProps & RefAttributes<HTMLSelectElement>>;
