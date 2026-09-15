import type { HTMLAttributes, ReactNode } from "react";
export interface TopNavLink { label: ReactNode; href?: string; icon?: string; active?: boolean; onClick?: (e: any) => void; }
export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  brand: { name: ReactNode; href?: string; mark?: ReactNode | null };
  links: TopNavLink[];
  /** Right end (notifications, account) */
  end?: ReactNode;
  sticky?: boolean;
  /** id of the page's main content. Renders the skip link as the first tab stop */
  skipTo?: string;
}
export declare function TopNav(props: TopNavProps): ReactNode;
