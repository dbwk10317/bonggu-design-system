import type { HTMLAttributes, ReactNode } from "react";
import type { InputHTMLAttributes } from "react";
export interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** 강도 미터 + 텍스트 표시(새 비밀번호에만) */
  strength?: boolean;
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
}
export declare function passwordStrength(s: string): 0 | 1 | 2 | 3 | 4;
export declare function PasswordField(props: PasswordFieldProps): JSX.Element;
