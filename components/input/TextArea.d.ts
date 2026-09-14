import type { ForwardRefExoticComponent, RefAttributes, TextareaHTMLAttributes } from "react";
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  /** flex = parent width (default), fixed = width, auto = content size */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  mono?: boolean;
  invalid?: boolean;
}
export declare const TextArea: ForwardRefExoticComponent<TextAreaProps & RefAttributes<HTMLTextAreaElement>>;
