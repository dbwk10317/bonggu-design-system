import type { ReactNode, TextareaHTMLAttributes } from "react";
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  /** flex=부모 폭(기본), fixed=width, auto=내용 크기 */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  mono?: boolean;
  invalid?: boolean;
}
export declare function TextArea(props: TextAreaProps): ReactNode;
