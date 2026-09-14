import type { HTMLAttributes, ReactNode } from "react";
export interface SidebarShellBrand { /** Omit for the Bonggu mark, null for no mark */ mark?: ReactNode; name: string; sub?: string }
/**
 * Dashboard shell: 240px sidebar + 52px top bar + body + 28px status bar. Drawer below 1024; status bar hidden below 768.
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
export declare function SidebarShell(props: SidebarShellProps): ReactNode;
export interface SidebarNavItemProps { icon?: string; label: ReactNode; href?: string; target?: string; active?: boolean; badge?: ReactNode; onClick?: () => void }
export declare function SidebarNavItem(props: SidebarNavItemProps): ReactNode;
export declare function SidebarNavGroup(props: { label: ReactNode }): ReactNode;
