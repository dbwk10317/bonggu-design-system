import type { ReactNode, SVGProps } from "react";
export type MascotFace = "neutral" | "curious" | "surprised" | "smiling" | "crying" | "worried" | "sleepy" | "excited" | "blank";
export type MascotSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
/**
 * 봉구 마스코트 마크. 표정 8종 + blank. 16~20px에서는 기본 얼굴 권장, 표정은 24px 이상.
 */
export interface MascotMarkProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  face?: MascotFace;
  /** XXS 16, XS 24, SM 32, MD 48(기본), LG 64, XL 96, XXL 128. 기존 px 값도 지원합니다. */
  size?: MascotSize | Uppercase<MascotSize> | number;
  /** neutral 눈 깜빡임 + 호버 귀 흔들기. 기본 true */
  animated?: boolean;
  "aria-label"?: string;
}
export declare function MascotMark(props: MascotMarkProps): ReactNode;
