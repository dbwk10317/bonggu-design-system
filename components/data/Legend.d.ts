import type { HTMLAttributes, ReactNode } from "react";
export interface LegendItem {
  label: ReactNode;
  /** 스와치 CSS 색. 주면 tone보다 우선 */
  color?: string;
  /** 시리즈 번호 1~8, 의미 키 rx·tx·used·reserved·free·ok·warn·crit, info·signal, 그 외 문자열은 CSS 색 */
  tone?: import("./Chart.d.ts").ChartTone;
  value?: ReactNode;
  /** shape="line"일 때 선 패턴(stroke-dasharray) */
  dash?: string;
  /** 항목별 스와치 모양. 생략하면 Legend의 shape */
  shape?: "square" | "line" | "dot";
  hidden?: boolean;
}
export interface LegendProps extends HTMLAttributes<HTMLUListElement> {
  items: LegendItem[];
  /** 기본 "square" */
  shape?: "square" | "line" | "dot";
  vertical?: boolean;
  /** 작은 글자(Chart 내장 범례용). 기본 false */
  compact?: boolean;
  /** 주면 클릭 토글 가능 */
  onToggle?: (index: number, item: LegendItem) => void;
}
export declare function Legend(props: LegendProps): ReactNode;
