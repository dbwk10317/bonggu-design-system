import type { HTMLAttributes, ReactNode } from "react";
/** Phosphor Bold icon wrapper. */
export interface IconProps extends HTMLAttributes<HTMLElement> {
  /** Phosphor icon name (kebab-case), e.g. "bell", "gear-six", "pulse" */
  name: string;
  /** px, default 16 */
  size?: number;
  /** Only when the icon carries meaning on its own; otherwise aria-hidden */
  label?: string;
}
export declare function Icon(props: IconProps): ReactNode;
