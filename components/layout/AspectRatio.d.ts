import type { HTMLAttributes, ReactNode } from "react";
/** 비율 고정 상자 */
export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** "16/9" | "4/3" | "1/1" | 숫자 */
  ratio?: string | number;
  children?: ReactNode;
}
export declare function AspectRatio(props: AspectRatioProps): ReactNode;
