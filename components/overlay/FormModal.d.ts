import type { FormEvent, ReactNode } from "react";
export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  title: ReactNode;
  description?: ReactNode;
  /** 동사. 기본 "저장". null이면 제출 버튼과 Enter 제출을 비활성화한다. */
  submitLabel?: string | null;
  cancelLabel?: string;
  busy?: boolean;
  danger?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  error?: ReactNode;
  children: ReactNode;
}
export declare function FormModal(props: FormModalProps): JSX.Element | null;
