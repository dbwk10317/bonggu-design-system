import type { ForwardRefExoticComponent, InputHTMLAttributes, ReactNode, RefAttributes } from "react";
/** Range slider for continuous or ordinal values such as brightness (1–5) or refresh interval. */
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "width"> {
  value?: number;
  defaultValue?: number;
  min?: number; max?: number; step?: number;
  /** Tick marks: numbers or {value,label} */
  marks?: (number | { value: number; label: ReactNode })[];
  showValue?: boolean;
  valueFormatter?: (v: number) => string;
  unit?: string;
  size?: "sm" | "md";
  fit?: "flex" | "fixed";
  width?: number | string;
  onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare const Slider: ForwardRefExoticComponent<SliderProps & RefAttributes<HTMLInputElement>>;
