/** @visualization */
import type { ReactNode, SVGProps } from "react";
/** Mini trend line. Fills its parent box. */
export interface SparklineProps extends Omit<SVGProps<SVGSVGElement>, "values"> { values: (number | null)[]; tone?: 1 | 2 | 3 | 4 | 5 | 6; area?: boolean }
export declare function Sparkline(props: SparklineProps): ReactNode;
