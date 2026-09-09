import type { HTMLAttributes, ReactNode } from "react";
import type { ElementType } from "react";
/** 가로 나열 */
export interface InlineProps extends HTMLAttributes<HTMLElement> {
  /** --sp 단계 번호 또는 CSS 길이. 주지 않으면 --inline-gap을 쓴다 */
  gap?: number | string;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
  /** 기본 true. false면 한 줄 유지 */
  wrap?: boolean;
  as?: ElementType;
  children?: ReactNode;
}
export declare function Inline(props: InlineProps): JSX.Element;
