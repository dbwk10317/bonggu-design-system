import type { HTMLAttributes, ReactNode } from "react";
/** 반응형 카드 격자. auto-fit(cols/min) 또는 고정 열(columns) + GridItem span. */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** 이상적 열 수(auto-fit). 2 | 3 | 4 */
  cols?: 2 | 3 | 4;
  /** 카드 최소 폭(px 또는 CSS 길이). 주면 cols 대신 쓴다 */
  min?: number | string;
  /** 고정 열 수(보통 12). 주면 자식 GridItem의 span을 쓴다 */
  columns?: number;
  children?: ReactNode;
}
export declare function Grid(props: GridProps): ReactNode;
export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** 격자 컨테이너 ≥900px에서의 칸 수 */
  span?: number;
  /** <900px */
  spanMd?: number;
  /** <640px. 480 미만은 항상 전폭 */
  spanSm?: number;
  children?: ReactNode;
}
export declare function GridItem(props: GridItemProps): ReactNode;
