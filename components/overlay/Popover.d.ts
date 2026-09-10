import type { HTMLAttributes, ReactNode } from "react";
import type { ReactElement } from "react";
export interface PopoverProps {
  trigger: ReactElement;
  title?: ReactNode;
  side?: "bottom" | "bottom-end" | "top" | "top-end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: ReactNode;
}
export declare function Popover(props: PopoverProps): ReactNode;
