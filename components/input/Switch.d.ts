import type { InputHTMLAttributes, ReactNode } from "react";
/** 즉시 반영되는 설정 토글. */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children?: ReactNode;
}
export declare function Switch(props: SwitchProps): JSX.Element;
