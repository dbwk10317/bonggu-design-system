import type { HTMLAttributes, ReactNode } from "react";
export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> { children?: ReactNode; /** Actions at the right end */ end?: ReactNode }
export declare function Toolbar(props: ToolbarProps): ReactNode;
export declare function ToolbarGrow(props: { children: ReactNode }): ReactNode;
