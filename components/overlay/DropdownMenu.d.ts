import type { ReactElement, ReactNode } from "react";
export interface MenuItem { label: ReactNode; icon?: string; onSelect?: () => void; danger?: boolean; disabled?: boolean; shortcut?: string }
/** 행 액션이 3개 이상일 때 "…" 메뉴로 접는다. 위험 동작은 맨 아래, 구분선 뒤. */
export interface DropdownMenuProps {
  items: (MenuItem | "-")[];
  /** 기본은 점 세 개 IconButton */
  trigger?: ReactElement;
  align?: "start" | "end";
  size?: "sm" | "md";
  "aria-label"?: string;
  className?: string;
}
export declare function DropdownMenu(props: DropdownMenuProps): JSX.Element;
