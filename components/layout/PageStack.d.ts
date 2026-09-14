import type { HTMLAttributes, ReactNode } from "react";
/** Direct child of the shell body. Sections are spaced by --grid-gap. */
export interface PageStackProps extends HTMLAttributes<HTMLElement> { gap?: "sm" | "md" | "lg"; children: ReactNode }
export declare function PageStack(props: PageStackProps): ReactNode;
