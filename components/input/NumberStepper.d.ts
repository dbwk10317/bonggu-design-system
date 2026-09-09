import type { InputHTMLAttributes } from "react";
/** 숫자 입력 + 증감 버튼. epochs, batch_size, 갱신 초 같은 작은 정수·소수. */
export interface NumberStepperProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "width"> {
  value?: number;
  defaultValue?: number;
  min?: number; max?: number; step?: number;
  unit?: string;
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  invalid?: boolean;
  onChange?: (value: number) => void;
}
export declare function NumberStepper(props: NumberStepperProps): JSX.Element;
