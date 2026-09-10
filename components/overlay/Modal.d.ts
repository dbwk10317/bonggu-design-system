import type { HTMLAttributes, ReactNode } from "react";
/**
 * 모달. 네이티브 <dialog>로 렌더되어 포커스가 안에 갇힌다. Esc·딤·닫기 → onClose. 640 미만 바텀시트.
 */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title" | "onClose"> {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** 오른쪽 정렬 버튼들 */
  actions?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeButton?: boolean;
  children?: ReactNode;
}
export declare function Modal(props: ModalProps): ReactNode;
