import type { ElementType, HTMLAttributes, ReactNode } from "react";
/**
 * 카드·패널. 층 구분은 보더로, 그림자는 최소.
 */
export interface PanelProps extends HTMLAttributes<HTMLElement> {
  caption?: ReactNode;
  padding?: "none" | "sm" | "md";
  sunken?: boolean;
  interactive?: boolean;
  selected?: boolean;
  /** 진입 fade-up */
  enter?: boolean;
  as?: ElementType;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
}
export declare function Panel(props: PanelProps): JSX.Element;
