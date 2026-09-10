import type { InputHTMLAttributes, ReactNode } from "react";
/**
 * 한 줄 텍스트 입력. Field 안에서 쓴다.
 */
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: "sm" | "md";
  /** flex=부모 폭(기본), fixed=width, auto=내용 크기 */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  /** 앞 아이콘(Phosphor) */
  icon?: string;
  prefix?: ReactNode;
  /** 단위 등 */
  suffix?: ReactNode;
  /** 수치·코드 입력이면 mono */
  mono?: boolean;
  invalid?: boolean;
}
export declare function TextField(props: TextFieldProps): ReactNode;
