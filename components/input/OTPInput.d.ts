import type { HTMLAttributes, ReactNode } from "react";
export interface OTPInputProps {
  length?: number;
  /** 자리별 숫자 문자열. 중간 빈 자리는 ASCII 공백, 말미 빈 자리는 생략한다. 완성값은 숫자만 포함한다. */
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
