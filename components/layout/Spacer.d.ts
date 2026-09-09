import type { HTMLAttributes, ReactNode } from "react";
/** flex 빈 공간 또는 고정 간격 */
export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  /** 고정 간격(--sp 단계 또는 CSS 길이). 없으면 남는 공간을 채운다 */
  size?: number | string;
}
export declare function Spacer(props: SpacerProps): JSX.Element;
