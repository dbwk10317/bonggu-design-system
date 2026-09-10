import type { HTMLAttributes, ReactNode } from "react";
export interface TopNavLink { label: ReactNode; href?: string; icon?: string; active?: boolean; onClick?: (e: any) => void; }
export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  brand: { name: ReactNode; href?: string; mark?: ReactNode | null };
  links: TopNavLink[];
  /** 오른쪽 끝(알림·계정) */
  end?: ReactNode;
  sticky?: boolean;
}
export declare function TopNav(props: TopNavProps): ReactNode;
