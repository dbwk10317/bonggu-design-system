import type { HTMLAttributes, ReactNode } from "react";
export interface UptimeSegment { status: "ok" | "warn" | "crit" | "off"; label?: string; }
export interface UptimeBarProps extends HTMLAttributes<HTMLDivElement> {
  name?: ReactNode;
  /** 가용성=(ok+warn)/(ok+warn+crit). off는 분모에서 제외, 수집된 칸이 없으면 미수집. 구간은 컨테이너 폭에 맞춰 같은 폭으로 줄어든다 */
  segments: UptimeSegment[];
  /** 왼쪽·오른쪽 끝 라벨 */
  start?: ReactNode;
  end?: ReactNode;
  height?: number;
  /** 직접 계산한 가용성(%)로 덮어씀 */
  uptime?: number;
}
export declare function UptimeBar(props: UptimeBarProps): ReactNode;
