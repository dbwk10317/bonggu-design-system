import type { ReactNode } from "react";
/** 범주형 1~8, 의미 고정 쌍 "rx"|"tx"|"used"|"reserved"|"free", 미터 임계 "ok"|"warn"|"crit"(radial·BarList) */
export type ChartTone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "rx" | "tx" | "used" | "reserved" | "free" | "ok" | "warn" | "crit";
export interface ChartSeries { key?: string; label: ReactNode; tone?: ChartTone; /** null은 미수집 구간(선을 끊는다) */ values: (number | null)[] }
export interface ChartSegment { label: ReactNode; value: number; tone?: ChartTone }
export interface ChartThreshold { value: number; label?: string; tone?: "warn" | "crit" | "info" | "ok" }
interface ChartBase {
  /** flex=부모 폭(기본), fixed=width·height */
  fit?: "flex" | "fixed";
  width?: number | string;
  /** 차트 영역 높이(px). 기본 line/area/bar 200, pie 180, radial 110, radar 260 */
  height?: number;
  /** 무엇의 차트인지. 옆 숫자가 설명하면 생략(aria-hidden) */
  "aria-label"?: string;
  valueFormatter?: (v: number) => string;
  /** 데이터 없을 때 문구. 기본 "수집 안 됨" */
  emptyText?: string;
  showLegend?: boolean;
  /** 진입 1회 그리기 모션. 기본 true(라이브 갱신 차트는 false) */
  animate?: boolean;
  className?: string;
}
export interface CartesianChartProps extends ChartBase {
  kind: "line" | "area" | "bar";
  labels: string[];
  /** 단위가 다른 계열은 한 차트에 겹치지 않는다 */
  series: ChartSeries[];
  xTicks?: "auto" | "ends" | "none";
  /** 임계선(경고·위험) */
  thresholds?: ChartThreshold[];
  /** bar만: 누적 */
  stacked?: boolean;
  yMin?: number; yMax?: number;
}
export interface PieChartProps extends ChartBase { kind: "pie"; segments: ChartSegment[]; /** 중앙 합계 아래 캡션 */ caption?: ReactNode }
export interface RadialChartProps extends ChartBase { kind: "radial"; /** 0~1 */ value: number | null; /** 중앙 수치 아래 상태 텍스트(색과 한 쌍) */ label?: ReactNode; tone?: ChartTone }
export interface RadarChartProps extends ChartBase { kind: "radar"; axes: string[]; series: ChartSeries[]; max?: number }
/** 분포(응답시간 p50/p95). samples는 원시 표본, 구간은 자동(√n) 또는 bins. percentiles는 0~1 비율(예: [0.5, 0.95]) */
export interface HistogramChartProps extends ChartBase { kind: "histogram"; samples: (number | null)[]; bins?: number; tone?: ChartTone; percentiles?: number[]; unit?: string }
export type ChartProps = CartesianChartProps | PieChartProps | RadialChartProps | RadarChartProps | HistogramChartProps;
/**
 * 단일 차트 컴포넌트. kind로 표현이 바뀌고 크롬(격자·축·범례·툴팁)은 공유한다.
 */
export declare function Chart(props: ChartProps): JSX.Element;
