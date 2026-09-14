import type { ForwardRefExoticComponent, RefAttributes, TextareaHTMLAttributes } from "react";
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  /** flex=부모 폭(기본), fixed=width, auto=내용 크기 */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  mono?: boolean;
  invalid?: boolean;
}
export declare const TextArea: ForwardRefExoticComponent<TextAreaProps & RefAttributes<HTMLTextAreaElement>>;
