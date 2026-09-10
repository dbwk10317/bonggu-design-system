import type { HTMLAttributes, ReactNode } from "react";
export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> { children?: ReactNode; /** 오른쪽 끝 액션 */ end?: ReactNode }
export declare function Toolbar(props: ToolbarProps): ReactNode;
export declare function ToolbarGrow(props: { children: ReactNode }): ReactNode;
