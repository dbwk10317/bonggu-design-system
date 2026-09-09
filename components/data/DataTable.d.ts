import type { HTMLAttributes, Key, ReactNode } from "react";
export interface DataTableColumn<T> { key: string; header: ReactNode; /** 수치 열: mono + 우측 정렬 */ align?: "num"; sortable?: boolean; width?: number | string; /** 컨테이너 640px 미만(tablet) / 900px 미만(desktop)에서 숨김 */ hideBelow?: "tablet" | "desktop"; hideOnMobile?: boolean; render?: (row: T, index: number) => ReactNode }
export interface DataTableSort { key: string; dir: "asc" | "desc" }
export interface DataTableHeader { title: ReactNode; meta?: ReactNode; id?: string }
/**
 * 데이터 표. 열 숨김은 컨테이너 쿼리, 숨긴 정보는 행 펼치기로.
 */
export interface DataTableProps<T = any> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  columns: DataTableColumn<T>[];
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
  /** flex=부모 폭(기본), fixed=width·height */
  fit?: "flex" | "fixed";
  width?: number | string;
  /** fixed일 때 표 영역 높이(내부 스크롤) */
  height?: number | string;
}
export declare function DataTable<T = any>(props: DataTableProps<T>): JSX.Element;
