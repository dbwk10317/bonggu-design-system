import type { ButtonHTMLAttributes, ReactNode } from "react";
export type NotificationTone = "info" | "warn" | "crit" | "ok";
export interface NotificationItem { id: string; title: string; description?: string; tone: NotificationTone; time: string; read: boolean; resolved?: boolean }
export interface NotificationTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onToggle"> { unreadCount?: number; open: boolean; onToggle: () => void; controls?: string }
export declare function NotificationTrigger(props: NotificationTriggerProps): ReactNode;
export interface NotificationDrawerProps { open: boolean; onClose: () => void; items?: NotificationItem[]; onRead?: (id: string) => void; onReadAll?: () => void; id?: string; className?: string }
export declare function NotificationDrawer(props: NotificationDrawerProps): ReactNode;
export declare const NOTIFICATION_DRAWER_ID: string;
