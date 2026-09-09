import type { HTMLAttributes, ReactNode } from "react";
export type KeyValueRow = [ReactNode, ReactNode, boolean?] | { k: ReactNode; v: ReactNode; mono?: boolean };
/** 값이 null·undefined·NaN이면 "수집 안 됨"으로 표시하고 mono를 벗는다(bds-na). 빈 문자열은 수집된 빈 값이라 그대로 빈 칸. */
export interface KeyValuesProps extends HTMLAttributes<HTMLDivElement> { rows: KeyValueRow[]; lined?: boolean }
export declare function KeyValues(props: KeyValuesProps): JSX.Element;
