import type { HTMLAttributes } from "react";
export interface SkeletonProps extends HTMLAttributes<HTMLElement> { variant?: "block" | "text" | "circle"; fit?: "flex" | "fixed"; width?: number | string; height?: number | string; /** 문장 여러 줄 */ lines?: number }
export declare function Skeleton(props: SkeletonProps): JSX.Element;
