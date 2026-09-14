import type { ReactNode } from "react";
export interface ConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title: ReactNode;
  message?: ReactNode;
  /** A single verb ("삭제", "재시작") */
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  danger?: boolean;
  /** Confirm enables only once this exact string is typed. The input resets on reopen or when the string changes. */
  typeToConfirm?: string;
  /** Locks confirm, cancel, Esc and backdrop dismissal. */
  busy?: boolean;
  size?: "sm" | "md";
}
export declare function ConfirmDialog(props: ConfirmDialogProps): ReactNode;
