import type { HTMLAttributes } from "react";
/** 색 선택(조명 ARGB). 스와치 picker + hex 입력 + 프리셋 칩. */
export interface ColorInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** #RRGGBB */
  value?: string;
  defaultValue?: string;
  presets?: string[];
  size?: "sm" | "md";
  fit?: "flex" | "fixed";
  width?: number | string;
  disabled?: boolean;
  invalid?: boolean;
  onChange?: (hex: string) => void;
  "aria-label"?: string;
}
export declare function ColorInput(props: ColorInputProps): JSX.Element;
