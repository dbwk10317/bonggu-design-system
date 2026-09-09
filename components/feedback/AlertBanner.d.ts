import type { HTMLAttributes, ReactNode } from "react";
export type AlertTone = "info" | "ok" | "warn" | "crit";
/**
 * 인라인 알림 배너.
 */
export interface AlertBannerProps extends HTMLAttributes<HTMLDivElement> { tone?: AlertTone; title?: ReactNode; onClose?: () => void; children?: ReactNode }
export declare function AlertBanner(props: AlertBannerProps): JSX.Element;
