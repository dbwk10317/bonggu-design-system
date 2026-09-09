import type { HTMLAttributes, ReactNode } from "react";
/** 브레이크포인트 표시 제어. sm 640 · md 768 · lg 1024 */
export interface VisibleProps {
  /** 이 폭 이상에서만 보임 */
  above?: "sm" | "md" | "lg";
  /** 이 폭 미만에서만 보임 */
  below?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}
export declare function Visible(props: VisibleProps): JSX.Element;
