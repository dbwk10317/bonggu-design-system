import type { HTMLAttributes, ReactNode } from "react";
export interface LegendItem { label: ReactNode; tone?: number | string; value?: ReactNode; hidden?: boolean; }
export interface LegendProps extends HTMLAttributes<HTMLUListElement> {
  items: LegendItem[];
  shape?: "square" | "line" | "dot";
  vertical?: boolean;
  /** 주면 클릭 토글 가능 */
  onToggle?: (index: number, item: LegendItem) => void;
}
export declare function Legend(props: LegendProps): JSX.Element;
