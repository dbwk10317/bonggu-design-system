import type { HTMLAttributes, ReactNode } from "react";
export type AlertTone = "info" | "ok" | "warn" | "crit";
/**
 * 인라인 알림 배너. warn·crit은 role="alert", info·ok는 role="status"로 렌더된다.
 */
export interface AlertBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> { tone?: AlertTone; title?: ReactNode; onClose?: () => void; children?: ReactNode }
export declare function AlertBanner(props: AlertBannerProps): ReactNode;
