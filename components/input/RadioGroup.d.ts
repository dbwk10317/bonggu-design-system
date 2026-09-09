import type { HTMLAttributes, ReactNode } from "react";
export interface RadioOption { value: string; label: ReactNode; hint?: ReactNode; disabled?: boolean; }
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  label?: ReactNode;
  layout?: "column" | "row" | "cards";
  disabled?: boolean;
}
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
