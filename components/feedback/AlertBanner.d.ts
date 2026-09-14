import type { HTMLAttributes, ReactNode } from "react";
export type AlertTone = "info" | "ok" | "warn" | "crit";
/**
 * Inline alert banner. warn/crit render role="alert", info/ok render role="status".
 */
export interface AlertBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> { tone?: AlertTone; title?: ReactNode; onClose?: () => void; children?: ReactNode }
export declare function AlertBanner(props: AlertBannerProps): ReactNode;
