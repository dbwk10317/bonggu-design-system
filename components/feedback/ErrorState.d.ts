import type { HTMLAttributes, ReactNode } from "react";
export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** Error code or request ID (mono) */
  code?: ReactNode;
  onRetry?: () => void;
  retryLabel?: ReactNode;
  actions?: ReactNode;
  mascot?: boolean;
}
export declare function ErrorState(props: ErrorStateProps): ReactNode;
