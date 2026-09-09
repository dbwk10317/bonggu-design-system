import type { HTMLAttributes, ReactNode } from "react";
/**
 * 모달. Esc·딤·닫기 → onClose. 640 미만 바텀시트.
 */
export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
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
export declare function Modal(props: ModalProps): JSX.Element | null;
