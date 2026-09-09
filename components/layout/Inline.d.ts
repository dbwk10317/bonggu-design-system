import type { HTMLAttributes, ReactNode } from "react";
import type { ElementType } from "react";
/** 가로 나열 */
export interface InlineProps extends HTMLAttributes<HTMLElement> {
  gap?: number | string;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
  /** 기본 true. false면 한 줄 유지 */
  wrap?: boolean;
  as?: ElementType;
  children?: ReactNode;
}
export declare function Inline(props: InlineProps): JSX.Element;
