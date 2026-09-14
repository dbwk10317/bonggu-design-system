import type { ReactNode } from "react";
export interface ToastOptions { message: ReactNode; tone?: "info" | "ok" | "warn" | "crit"; action?: string; onAction?: () => void; /** ms; 0 keeps it until dismissed. Default 4000 */ duration?: number }
export declare function ToastProvider(props: { children: ReactNode; max?: number }): ReactNode;
export declare function useToast(): { toast: (o: ToastOptions) => number; dismiss: (id: number) => void };
export interface ToastProps extends ToastOptions { onDismiss?: () => void; /** Exiting; set by the Provider just before removal */ leaving?: boolean; className?: string }
export declare function Toast(props: ToastProps): ReactNode;
