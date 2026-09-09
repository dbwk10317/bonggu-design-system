import type { HTMLAttributes, ReactNode } from "react";
export interface CardHeadProps extends HTMLAttributes<HTMLDivElement> { title: ReactNode; meta?: ReactNode; metaMono?: boolean }
export declare function CardHead(props: CardHeadProps): JSX.Element;
