import type { InputHTMLAttributes, ReactNode } from "react";
/** 체크박스(radio=true면 라디오). 라벨 없이 쓰면 aria-label 필수. */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children?: ReactNode;
  radio?: boolean;
  indeterminate?: boolean;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
