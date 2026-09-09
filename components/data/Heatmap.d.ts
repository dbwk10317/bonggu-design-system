import type { HTMLAttributes, ReactNode } from "react";
/** 2차원 강도 격자(시간×요일 요청량, GPU 사용 패턴). 순차 램프 --ramp-1~6만 사용. */
export interface HeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  rows: ReactNode[];
  cols: ReactNode[];
  /** values[rowIndex][colIndex]; null = 수집 안 됨 */
  values: (number | null)[][];
  valueFormatter?: (v: number) => string;
  rowLabel?: (r: ReactNode) => ReactNode;
  colLabel?: (c: ReactNode) => ReactNode;
  /** 셀 최소 크기 px(기본 14). flex면 폭에 맞춰 늘어난다 */
  cell?: number;
  gap?: number;
  fit?: "flex" | "fixed";
  width?: number | string;
  "aria-label"?: string;
}
export declare function Heatmap(props: HeatmapProps): JSX.Element;
