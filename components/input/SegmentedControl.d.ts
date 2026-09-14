import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
export interface SegmentedOption { value: string; label: React.ReactNode; disabled?: boolean }
/** 2–5 mutually exclusive options. */
export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
  /** auto = content (default), flex = even split, fixed = width */
  fit?: "auto" | "flex" | "fixed";
  width?: number | string;
  "aria-label": string;
}
export declare const SegmentedControl: ForwardRefExoticComponent<SegmentedControlProps & RefAttributes<HTMLDivElement>>;
