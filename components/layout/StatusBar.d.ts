import type { HTMLAttributes, ReactNode } from "react";
export interface StatusBarProps extends HTMLAttributes<HTMLDivElement> { live?: { label: string }; items?: ReactNode[]; right?: ReactNode[] }
export declare function StatusBar(props: StatusBarProps): JSX.Element;
