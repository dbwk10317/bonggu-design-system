import type { HTMLAttributes, Key, ReactNode } from "react";
export interface DataTableColumn<T> { key: string; header: ReactNode; /** 수치 열: mono + 우측 정렬 */ align?: "num"; sortable?: boolean; width?: number | string; /** 컨테이너 640px 미만(tablet) / 900px 미만(desktop)에서 숨김 */ hideBelow?: "tablet" | "desktop"; hideOnMobile?: boolean;
  /**
   * 셀 표시를 직접 만든다. 반환은 ReactNode이므로 null은 React 규칙대로 "아무것도 그리지 않음"이며 결측이 아니다.
   * 결측을 표시하려면 render를 두지 않고 값에 null을 넣거나, 문구("수집 안 됨")를 그대로 반환한다.
   */
  render?: (row: T, index: number) => ReactNode }
export interface DataTableSort { key: string; dir: "asc" | "desc" }
export interface DataTableHeader { title: ReactNode; meta?: ReactNode; id?: string }
/**
 * 데이터 표. 열 숨김은 컨테이너 쿼리, 숨긴 정보는 행 펼치기로.
 *
 * 결측 계약: render 없는 열은 row[key]가 null·undefined·NaN이면 빈 칸이 아니라 "수집 안 됨"으로 표시하고
 * 공통 클래스(bds-na)를 붙인다. 빈 문자열·0·false는 수집된 값이므로 그대로 그린다.
 * 판정과 문구는 components/core/missing.js 한 곳에서 나온다.
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
