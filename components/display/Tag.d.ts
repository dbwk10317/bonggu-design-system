import type { HTMLAttributes, ReactNode } from "react";
/** Tag for categories and selections. */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  accent?: boolean;
  icon?: string;
  onRemove?: () => void;
  children: ReactNode;
}
export declare function Tag(props: TagProps): ReactNode;
