import type { HTMLAttributes } from "react";
export interface SegmentedOption { value: string; label: React.ReactNode; disabled?: boolean }
/** 2~5개 상호배타 선택. */
export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
  /** auto=내용(기본), flex=균등 분할, fixed=width */
  fit?: "auto" | "flex" | "fixed";
  width?: number | string;
  "aria-label": string;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
