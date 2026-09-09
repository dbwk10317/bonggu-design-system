import type { SVGProps } from "react";
export type MascotFace = "neutral" | "curious" | "surprised" | "smiling" | "crying" | "worried" | "sleepy" | "excited" | "blank";
/**
 * 봉구 마스코트 마크. 표정 8종 + blank. 16~20px에서는 neutral만, 표정은 24px 이상.
 */
export interface MascotMarkProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  face?: MascotFace;
  /** px. 기본 26 */
  size?: number;
  /** neutral 눈 깜빡임 + 호버 귀 흔들기. 기본 true */
  animated?: boolean;
  "aria-label"?: string;
}
export declare function MascotMark(props: MascotMarkProps): JSX.Element;
