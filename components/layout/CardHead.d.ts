import type { HTMLAttributes, ReactNode } from "react";
export interface CardHeadProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> { title: ReactNode; meta?: ReactNode; metaMono?: boolean }
export declare function CardHead(props: CardHeadProps): ReactNode;
