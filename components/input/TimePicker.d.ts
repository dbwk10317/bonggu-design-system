import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
export interface TimePickerProps {
  /** "HH:MM", 24-hour */
  value?: string;
  onChange?: (value: string) => void;
  /** Minute step (default 5) */
  step?: number;
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  disabled?: boolean;
  className?: string;
  style?: any;
}
export declare const TimePicker: ForwardRefExoticComponent<TimePickerProps & RefAttributes<HTMLSelectElement>>;
