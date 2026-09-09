import type { ReactNode } from "react";
export interface ToastOptions { message: ReactNode; tone?: "info" | "ok" | "warn" | "crit"; action?: string; onAction?: () => void; /** ms, 0이면 유지. 기본 4000 */ duration?: number }
export declare function ToastProvider(props: { children: ReactNode; max?: number }): JSX.Element;
export declare function useToast(): { toast: (o: ToastOptions) => number; dismiss: (id: number) => void };
export interface ToastProps extends ToastOptions { onDismiss?: () => void; /** 퇴장 중. Provider가 제거 직전에 세운다 */ leaving?: boolean; className?: string }
export declare function Toast(props: ToastProps): JSX.Element;
