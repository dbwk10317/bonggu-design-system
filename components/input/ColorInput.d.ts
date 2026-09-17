import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
/** Color picker (lighting ARGB): swatch picker + hex input + preset chips. */
export interface ColorInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** #RRGGBB */
  value?: string;
  defaultValue?: string;
  presets?: string[];
  size?: "sm" | "md";
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  disabled?: boolean;
  invalid?: boolean;
  onChange?: (hex: string) => void;
  "aria-label"?: string;
}
export declare const ColorInput: ForwardRefExoticComponent<ColorInputProps & RefAttributes<HTMLInputElement>>;
