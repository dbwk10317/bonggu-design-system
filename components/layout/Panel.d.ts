import type { ElementType, HTMLAttributes, ReactNode } from "react";
/**
 * 카드·패널. 층 구분은 보더로, 그림자는 최소.
 */
export interface PanelProps extends HTMLAttributes<HTMLElement> {
  caption?: ReactNode;
  padding?: "none" | "sm" | "md";
  sunken?: boolean;
  /** 호버 상승과 커서만 주는 시각 prop. 조작 가능한 카드는 as="button"을 함께 쓴다 */
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
