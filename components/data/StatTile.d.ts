import type { HTMLAttributes, ReactNode } from "react";
/**
 * 큰 수치 타일. 숫자면 mono(ko-KR 천 단위), 문자열이면 그대로. 기본은 즉시 갱신.
 */
export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: number | string;
  unit?: string;
  /** 소수 자릿수 */
  digits?: number;
  /** 증감(숫자면 부호·색 자동) */
  delta?: number | string;
  deltaLabel?: string;
  /** 최근 추세 */
  spark?: (number | null)[];
  /** 수치 아래 보조 줄(Tag 나열, 마지막 갱신 등) */
  detail?: ReactNode;
  /** 라벨 옆 상태 pill */
  pill?: { tone: "ok" | "warn" | "crit" | "info" | "off"; text: string };
  /** 라벨 앞 Phosphor 아이콘 */
  icon?: string;
  tone?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 카드 테두리 없이(Panel 안에 여러 개) */
  flat?: boolean;
  /** 진입 1회 카운트업. 기본 false(실시간 수치는 트랜지션 없이 즉시 바뀐다) */
  animate?: boolean;
  /** flex=부모 폭(기본), fixed=width·height */
  fit?: "flex" | "fixed";
  width?: number | string;
}
export declare function StatTile(props: StatTileProps): JSX.Element;
