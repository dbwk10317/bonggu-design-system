import type { HTMLAttributes, ReactNode } from "react";
export interface DescriptionItem { term: ReactNode; detail: ReactNode; mono?: boolean }
export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> { items: DescriptionItem[] }
export declare function DescriptionList(props: DescriptionListProps): ReactNode;
