import type { HTMLAttributes, ReactNode } from "react";
/** Copy-only value: a token shown once, an identifier, a curl example. */
export interface CopyFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onCopy"> {
  value: string;
  label?: ReactNode;
  multiline?: boolean;
  /** Masked, with a reveal toggle */
  secret?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  onCopy?: (ok: boolean) => void;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
}
export declare function CopyField(props: CopyFieldProps): ReactNode;
