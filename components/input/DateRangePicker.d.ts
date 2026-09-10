import type { HTMLAttributes, ReactNode } from "react";
export interface DateRange { preset?: string; from?: Date; to?: Date }
export interface RangePreset { value: string; label: string }
/** 차트·표 기간 선택. "최근 N" 프리셋 + 직접 시작/끝. */
export interface DateRangePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: DateRange;
  onChange: (value: DateRange) => void;
  presets?: RangePreset[];
  allowCustom?: boolean;
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  disabled?: boolean;
  "aria-label"?: string;
}
export declare function DateRangePicker(props: DateRangePickerProps): ReactNode;
