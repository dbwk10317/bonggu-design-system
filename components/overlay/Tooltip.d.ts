import type { ReactElement, ReactNode } from "react";
/** 범용 툴팁. 아이콘 버튼 라벨, 잘린 텍스트 전문. 클릭 가능한 내용은 Popover/DropdownMenu. */
export interface TooltipProps {
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  /** ms, 기본 300 */
  delay?: number;
  children: ReactElement;
  className?: string;
}
export declare function Tooltip(props: TooltipProps): ReactNode;
