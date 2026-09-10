import type { HTMLAttributes, ReactNode } from "react";
import type { AnchorHTMLAttributes } from "react";
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  /** 본문색(강조 없음) */
  quiet?: boolean;
  children?: ReactNode;
}
export declare function Link(props: LinkProps): ReactNode;
