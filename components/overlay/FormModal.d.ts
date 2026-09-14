import type { FormEvent, ReactNode } from "react";
export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  title: ReactNode;
  description?: ReactNode;
  /** A verb; default "저장". null removes the submit button and disables Enter submit. */
  submitLabel?: string | null;
  cancelLabel?: string;
  busy?: boolean;
  danger?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  error?: ReactNode;
  children: ReactNode;
}
export declare function FormModal(props: FormModalProps): ReactNode;
