import type { HTMLAttributes, ReactNode } from "react";
export interface TabItem { value: string; label: ReactNode; count?: number; icon?: string }
/** 화면 안 뷰 전환 탭. 선택 탭만 Tab 순서에 들고 화살표·Home·End로 옮긴다. 넘치면 가로 스크롤. */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** 탭 value → 대응 패널의 id. 주면 각 탭에 aria-controls가 붙는다. */
  panelId?: (value: string) => string;
  "aria-label"?: string;
}
export declare function Tabs(props: TabsProps): JSX.Element;
