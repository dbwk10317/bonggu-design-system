import type { HTMLAttributes, ReactNode } from "react";
export interface ConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title: ReactNode;
  message?: ReactNode;
  /** 동사 하나("삭제", "재시작") */
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  danger?: boolean;
  /** 이 문자열을 그대로 입력해야 확인 활성 */
  typeToConfirm?: string;
  busy?: boolean;
  size?: "sm" | "md";
}
export declare function ConfirmDialog(props: ConfirmDialogProps): JSX.Element;
