import type { HTMLAttributes, ReactNode } from "react";
export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** 구분 간격(기본 3). 0이면 없음 */
  group?: number;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}
export declare function OTPInput(props: OTPInputProps): JSX.Element;
