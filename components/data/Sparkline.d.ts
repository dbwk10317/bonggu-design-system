import type { ReactNode, SVGProps } from "react";
/** 미니 추세선. 부모 박스를 채운다. */
export interface SparklineProps extends Omit<SVGProps<SVGSVGElement>, "values"> { values: (number | null)[]; tone?: 1 | 2 | 3 | 4 | 5 | 6; area?: boolean }
export declare function Sparkline(props: SparklineProps): ReactNode;
