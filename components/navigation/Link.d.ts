import type { HTMLAttributes, ReactNode } from "react";
import type { AnchorHTMLAttributes } from "react";
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  /** Body text color, no emphasis */
  quiet?: boolean;
  children?: ReactNode;
}
export declare function Link(props: LinkProps): ReactNode;
