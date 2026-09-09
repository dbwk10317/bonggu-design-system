import type { HTMLAttributes, ReactNode } from "react";
export interface SidebarShellBrand { /** 생략=봉구 마크, null=마크 없음 */ mark?: ReactNode; name: string; sub?: string }
/**
 * 대시보드 셸. 240px 사이드바 + 52px 상단바 + 본문 + 28px 상태바. 1024 미만 드로어, 768 미만 상태바 숨김.
 */
export interface SidebarShellProps extends HTMLAttributes<HTMLDivElement> {
  brand: SidebarShellBrand;
  /** SidebarNavItem / SidebarNavGroup */
  nav: ReactNode;
  navLabel?: string;
  footer?: ReactNode;
  topbar?: ReactNode;
  /** StatusBar */
  statusbar?: ReactNode;
  children?: ReactNode;
}
export declare function SidebarShell(props: SidebarShellProps): JSX.Element;
export interface SidebarNavItemProps { icon?: string; label: ReactNode; href?: string; target?: string; active?: boolean; badge?: ReactNode; onClick?: () => void }
export declare function SidebarNavItem(props: SidebarNavItemProps): JSX.Element;
export declare function SidebarNavGroup(props: { label: ReactNode }): JSX.Element;
