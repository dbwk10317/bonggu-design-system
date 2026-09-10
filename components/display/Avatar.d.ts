import type { HTMLAttributes, ReactNode } from "react";
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string;
  /** xs 20 · sm 24 · md 32 · lg 40 · xl 56 · 숫자 px */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  square?: boolean;
  /** 온라인 점(색+title 병기) */
  status?: "ok" | "warn" | "crit" | "off";
}
export interface AvatarGroupProps { users: AvatarProps[]; max?: number; size?: AvatarProps["size"]; className?: string; }
export declare function AvatarGroup(props: AvatarGroupProps): ReactNode;
export declare function Avatar(props: AvatarProps): ReactNode;
