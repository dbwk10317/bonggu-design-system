import type { HTMLAttributes, ReactNode } from "react";
/** 복사 전용 값. 토큰 원문(1회 표시), 식별자, curl 호출 예시. */
export interface CopyFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onCopy"> {
  value: string;
  label?: ReactNode;
  multiline?: boolean;
  /** 마스킹 + 보기 토글 */
  secret?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  onCopy?: (ok: boolean) => void;
  fit?: "flex" | "fixed";
  width?: number | string;
}
export declare function CopyField(props: CopyFieldProps): ReactNode;
