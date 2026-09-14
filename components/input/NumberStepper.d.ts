import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
/** Number input with step buttons. Small integers and decimals such as epochs, batch_size, refresh seconds. */
export interface NumberStepperProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "width"> {
  value?: number;
  defaultValue?: number;
  min?: number; max?: number; step?: number;
  unit?: string;
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  invalid?: boolean;
  /** Called only with numbers committed on blur, Enter or the step buttons. Empty or out-of-range text stays in the editing state. */
  onChange?: (value: number) => void;
}
export declare const NumberStepper: ForwardRefExoticComponent<NumberStepperProps & RefAttributes<HTMLInputElement>>;
