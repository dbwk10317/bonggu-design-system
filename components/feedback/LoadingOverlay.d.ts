import type { HTMLAttributes, ReactNode } from "react";
export interface LoadingOverlayProps {
  active?: boolean;
  label?: ReactNode;
  /** 전체 화면 */
  fixed?: boolean;
  className?: string;
  children?: ReactNode;
}
export declare function LoadingOverlay(props: LoadingOverlayProps): ReactNode;
