import type { HTMLAttributes, ReactNode } from "react";
export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> { title: ReactNode; description?: ReactNode; actions?: ReactNode }
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
