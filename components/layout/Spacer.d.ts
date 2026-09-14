import type { HTMLAttributes, ReactNode } from "react";
/** Flex filler or fixed gap */
export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  /** Fixed gap (--sp step or CSS length); without it, fills the remaining space */
  size?: number | string;
}
export declare function Spacer(props: SpacerProps): ReactNode;
