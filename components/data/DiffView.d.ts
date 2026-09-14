import type { HTMLAttributes, ReactNode } from "react";
export interface DiffChange { field: string; from?: string | number | null; to?: string | number | null; kind?: "changed" | "added" | "removed" }
/** Field-level change comparison, e.g. a project revision diff. */
export interface DiffViewProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  changes: DiffChange[];
  from?: ReactNode;
  to?: ReactNode;
  emptyText?: ReactNode;
  fit?: "flex" | "fixed";
  width?: number | string;
  "aria-label"?: string;
}
export declare function DiffView(props: DiffViewProps): ReactNode;
