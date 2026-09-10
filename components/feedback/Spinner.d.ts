import type { HTMLAttributes, ReactNode } from "react";
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> { size?: number; label?: string; mascot?: boolean }
export declare function Spinner(props: SpinnerProps): ReactNode;
