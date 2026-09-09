import type { HTMLAttributes, ReactNode } from "react";
import type { ElementType } from "react";
/** 세로 스택 */
export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** --sp 단계(1~10) 또는 CSS 길이 */
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
  as?: ElementType;
  children?: ReactNode;
}
export declare function Stack(props: StackProps): JSX.Element;
