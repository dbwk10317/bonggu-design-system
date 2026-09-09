import type { HTMLAttributes, ReactNode } from "react";
export interface BreadcrumbItem { label: ReactNode; href?: string; onClick?: (e: any) => void; }
export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** 초과 시 중간을 접음(기본 4) */
  maxItems?: number;
}
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
