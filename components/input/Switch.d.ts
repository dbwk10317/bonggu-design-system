import type { ForwardRefExoticComponent, InputHTMLAttributes, ReactNode, RefAttributes } from "react";
/** Toggle for settings that apply immediately. */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children?: ReactNode;
}
export declare const Switch: ForwardRefExoticComponent<SwitchProps & RefAttributes<HTMLInputElement>>;
