import type { HTMLAttributes, ReactNode } from "react";
/** 태그(분류·선택 표시). */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  accent?: boolean;
  icon?: string;
  onRemove?: () => void;
  children: ReactNode;
}
export declare function Tag(props: TagProps): ReactNode;
