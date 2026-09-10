import type { ReactNode } from "react";
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
  /** 이 문자열을 그대로 입력해야 확인 활성. 재개방·문자열 변경 시 입력 초기화. */
  typeToConfirm?: string;
  /** 확인·취소·Esc·딤 닫기를 모두 잠근다. */
  busy?: boolean;
  size?: "sm" | "md";
}
export declare function ConfirmDialog(props: ConfirmDialogProps): ReactNode;
