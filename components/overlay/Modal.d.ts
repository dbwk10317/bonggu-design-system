import type { HTMLAttributes, ReactNode } from "react";
/**
 * Modal on a native <dialog>, so focus stays inside. Esc, backdrop and close button call onClose. Bottom sheet below 640.
 */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title" | "onClose"> {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Right-aligned buttons */
  actions?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeButton?: boolean;
  children?: ReactNode;
}
export declare function Modal(props: ModalProps): ReactNode;
