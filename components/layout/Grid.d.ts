import type { HTMLAttributes, ReactNode } from "react";
/** Responsive card grid: auto-fit (cols/min) or fixed columns (columns) with GridItem spans. */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Ideal column count (auto-fit). 2 | 3 | 4 */
  cols?: 2 | 3 | 4;
  /** Minimum card width (px or CSS length); overrides cols */
  min?: number | string;
  /** Fixed column count (usually 12); children use GridItem span */
  columns?: number;
  children?: ReactNode;
}
export declare function Grid(props: GridProps): ReactNode;
export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns spanned when the grid container is ≥900px */
  span?: number;
  /** <900px */
  spanMd?: number;
  /** <640px; below 480 always full width */
  spanSm?: number;
  children?: ReactNode;
}
export declare function GridItem(props: GridItemProps): ReactNode;
