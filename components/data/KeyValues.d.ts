import type { HTMLAttributes, ReactNode } from "react";
export type KeyValueRow = [ReactNode, ReactNode, boolean?] | { k: ReactNode; v: ReactNode; mono?: boolean };
/** Missing values (null/undefined/NaN) show "수집 안 됨" without mono (bds-na). An empty string is a collected empty value and stays blank. */
export interface KeyValuesProps extends HTMLAttributes<HTMLDivElement> { rows: KeyValueRow[]; lined?: boolean }
export declare function KeyValues(props: KeyValuesProps): ReactNode;
