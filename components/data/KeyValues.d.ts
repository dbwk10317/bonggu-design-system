import type { HTMLAttributes, ReactNode } from "react";
export type KeyValueRow = [ReactNode, ReactNode, boolean?] | { k: ReactNode; v: ReactNode; mono?: boolean };
export interface KeyValuesProps extends HTMLAttributes<HTMLDivElement> { rows: KeyValueRow[]; lined?: boolean }
export declare function KeyValues(props: KeyValuesProps): JSX.Element;
