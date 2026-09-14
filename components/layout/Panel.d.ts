import type { ElementType, HTMLAttributes, ReactNode } from "react";
/**
 * Card / panel. Layers are separated by borders; shadows are minimal.
 */
export interface PanelProps extends HTMLAttributes<HTMLElement> {
  caption?: ReactNode;
  padding?: "none" | "sm" | "md";
  sunken?: boolean;
  /** Visual only (hover lift and cursor). An operable card also needs as="button" */
  interactive?: boolean;
  selected?: boolean;
  /** Fade-up on enter */
  enter?: boolean;
  as?: ElementType;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
}
export declare function Panel(props: PanelProps): ReactNode;
