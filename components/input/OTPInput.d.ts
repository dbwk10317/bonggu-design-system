import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
export interface OTPInputProps {
  length?: number;
  /** Per-box digit string. Inner blanks are ASCII spaces, trailing blanks are omitted. A complete value contains digits only. */
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Separator interval (default 3). 0 disables it */
  group?: number;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}
export declare const OTPInput: ForwardRefExoticComponent<OTPInputProps & RefAttributes<HTMLInputElement>>;
