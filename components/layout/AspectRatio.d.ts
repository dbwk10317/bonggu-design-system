import type { HTMLAttributes, ReactNode } from "react";
/** Fixed aspect-ratio box */
export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** "16/9" | "4/3" | "1/1" | number */
  ratio?: string | number;
  children?: ReactNode;
}
export declare function AspectRatio(props: AspectRatioProps): ReactNode;
