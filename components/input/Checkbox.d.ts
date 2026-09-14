import type { ForwardRefExoticComponent, InputHTMLAttributes, ReactNode, RefAttributes } from "react";
/** Checkbox (radio when radio=true). aria-label is required when used without a label. */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children?: ReactNode;
  radio?: boolean;
  indeterminate?: boolean;
}
export declare const Checkbox: ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLInputElement>>;
