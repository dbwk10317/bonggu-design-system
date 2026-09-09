import type { FormEvent, ReactNode } from "react";
export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  title: ReactNode;
  description?: ReactNode;
  /** 동사. 기본 "저장" */
  submitLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  danger?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  error?: ReactNode;
  children: ReactNode;
}
export declare function FormModal(props: FormModalProps): JSX.Element | null;
