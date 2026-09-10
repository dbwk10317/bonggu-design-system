import type { HTMLAttributes, ReactNode } from "react";
/** 셸 본문 직계 자식. 섹션 간격 --grid-gap. */
export interface PageStackProps extends HTMLAttributes<HTMLElement> { gap?: "sm" | "md" | "lg"; children: ReactNode }
export declare function PageStack(props: PageStackProps): ReactNode;
