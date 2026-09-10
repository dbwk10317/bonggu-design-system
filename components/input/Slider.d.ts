import type { InputHTMLAttributes, ReactNode } from "react";
/** 범위 슬라이더. 밝기(1~5), 갱신 주기 같은 연속·서열 값. 3개 이하 선택지는 SegmentedControl. */
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "width"> {
  value?: number;
  defaultValue?: number;
  min?: number; max?: number; step?: number;
  /** 눈금. 숫자 또는 {value,label} */
  marks?: (number | { value: number; label: ReactNode })[];
  showValue?: boolean;
  valueFormatter?: (v: number) => string;
  unit?: string;
  size?: "sm" | "md";
  fit?: "flex" | "fixed";
  width?: number | string;
  onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare function Slider(props: SliderProps): ReactNode;
