import type { HTMLAttributes, ReactNode } from "react";
export interface SkeletonProps extends HTMLAttributes<HTMLElement> { variant?: "block" | "text" | "circle"; fit?: "flex" | "fixed" | "auto"; width?: number | string; height?: number | string; /** Number of text lines */ lines?: number }
export declare function Skeleton(props: SkeletonProps): ReactNode;
