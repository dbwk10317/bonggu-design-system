import type { ReactNode, SVGProps } from "react";
export type MascotFace = "neutral" | "curious" | "surprised" | "smiling" | "crying" | "worried" | "sleepy" | "excited" | "blank";
export type MascotSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
/**
 * Bonggu mascot mark. 8 faces + blank. At 16–20px prefer the default face; expressions read from 24px up.
 */
export interface MascotMarkProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  face?: MascotFace;
  /** XXS 16, XS 24, SM 32, MD 48 (default), LG 64, XL 96, XXL 128. Legacy px numbers are also accepted. */
  size?: MascotSize | Uppercase<MascotSize> | number;
  /** neutral blink + ear wiggle on hover. Default true */
  animated?: boolean;
  "aria-label"?: string;
}
export declare function MascotMark(props: MascotMarkProps): ReactNode;
