/** @responsive */
import type { HTMLAttributes, Key, ReactNode } from "react";
export interface DataTableColumn<T> { key: string; header: ReactNode; /** Numeric column: mono, right-aligned */ align?: "num"; sortable?: boolean; width?: number | string; /** Hidden below a 640px (tablet) / 900px (desktop) container width */ hideBelow?: "tablet" | "desktop";
  /**
   * Custom cell renderer. The result is a ReactNode, so null means "render nothing" per React, not missing.
   * To show a missing value, omit render and pass null as the value, or return the missing text ("수집 안 됨") itself.
   */
  render?: (row: T, index: number) => ReactNode }
export interface TableColumnState { key: string; hidden?: boolean; width?: number; pinned?: boolean }
export interface DataTableSort { key: string; dir: "asc" | "desc" }
export interface DataTableHeader { title: ReactNode; meta?: ReactNode; id?: string }
/**
 * Data table. Columns hide by container query; hidden detail is reached by expanding the row.
 *
 * Without render, a null/undefined/NaN row[key] shows "수집 안 됨" (class bds-na) instead of a blank cell;
 * empty string, 0 and false are collected values and render as is. Detection and text come from components/core/missing.js.
 */
export interface DataTableProps<T = any> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  columns: DataTableColumn<T>[];
  /** Entries define order; unknown keys are ignored and new columns are appended. */
  columnState?: TableColumnState[];
  onColumnStateChange?: (state: TableColumnState[]) => void;
  /** Show the accessible column configuration panel. Default false. */
  columnSettings?: boolean;
  rows: T[];
  rowKey?: (row: T, index: number) => Key;
  rowLabel?: (row: T) => string;
  sort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  selectable?: boolean;
  selectedKeys?: Key[];
  onSelectionChange?: (keys: Key[]) => void;
  bulkActions?: ReactNode;
  expandable?: (row: T) => ReactNode;
  defaultExpandedKeys?: Key[];
  header?: DataTableHeader;
  empty?: ReactNode;
  /** flex = parent width (default), fixed = width/height */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  /** Table area height when fixed (scrolls internally) */
  height?: number | string;
}
export declare function DataTable<T = any>(props: DataTableProps<T>): ReactNode;
