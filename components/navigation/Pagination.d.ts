import type { HTMLAttributes, ReactNode } from "react";
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** 1-based */
  page: number;
  /** Total page count */
  total: number;
  onChange?: (page: number) => void;
  /** Numbers shown on each side of the current page (default 1) */
  siblings?: number;
  /** Range text such as "1–20 / 184" */
  info?: ReactNode;
  size?: "sm" | "md";
}
export declare function Pagination(props: PaginationProps): ReactNode;
