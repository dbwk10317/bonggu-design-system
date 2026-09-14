import type { ReactElement, ReactNode } from "react";
/** Generic tooltip for icon-button labels and truncated text. Clickable content belongs in Popover/DropdownMenu. */
export interface TooltipProps {
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  /** ms, default 300 */
  delay?: number;
  children: ReactElement;
  className?: string;
}
export declare function Tooltip(props: TooltipProps): ReactNode;
