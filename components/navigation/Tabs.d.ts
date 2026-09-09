import type { HTMLAttributes, ReactNode } from "react";
export interface TabItem { value: string; label: ReactNode; count?: number; icon?: string }
/** 화면 안 뷰 전환 탭. 넘치면 가로 스크롤. */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
}
export declare function Tabs(props: TabsProps): JSX.Element;
