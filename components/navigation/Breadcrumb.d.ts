import type { HTMLAttributes, ReactNode } from "react";
export interface BreadcrumbItem { label: ReactNode; href?: string; onClick?: (e: any) => void; }
export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Beyond this, the middle collapses (default 4) */
  maxItems?: number;
}
export declare function Breadcrumb(props: BreadcrumbProps): ReactNode;
