import type { HTMLAttributes, ReactNode } from "react";
export interface TimelineItem { id?: string; time: ReactNode; title: ReactNode; detail?: ReactNode; tone?: "ok" | "warn" | "crit" | "info" | "off" | "accent"; icon?: string }
/** 시간축 이벤트 목록. "최근 운영 변화", lease 전이, 학습 stage 이력. */
export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  items: TimelineItem[];
  dense?: boolean;
  fit?: "flex" | "fixed";
  width?: number | string;
  "aria-label"?: string;
}
export declare function Timeline(props: TimelineProps): ReactNode;
