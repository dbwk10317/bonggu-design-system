import type { HTMLAttributes, ReactNode } from "react";
export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  description?: ReactNode;
  /** 오류 코드·요청 ID(mono) */
  code?: ReactNode;
  onRetry?: () => void;
  retryLabel?: ReactNode;
  actions?: ReactNode;
  mascot?: boolean;
}
export declare function ErrorState(props: ErrorStateProps): JSX.Element;
