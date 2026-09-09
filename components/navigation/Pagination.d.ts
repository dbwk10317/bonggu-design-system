import type { HTMLAttributes, ReactNode } from "react";
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** 1부터 */
  page: number;
  /** 총 페이지 수 */
  total: number;
  onChange?: (page: number) => void;
  /** 현재 페이지 양옆 번호 수(기본 1) */
  siblings?: number;
  /** "1–20 / 184" 같은 범위 표시 */
  info?: ReactNode;
  size?: "sm" | "md";
}
export declare function Pagination(props: PaginationProps): JSX.Element;
