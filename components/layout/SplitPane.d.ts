/** @responsive */
import type { HTMLAttributes, ReactNode } from "react";
export interface SplitPaneProps extends HTMLAttributes<HTMLDivElement> {
  first: ReactNode; second: ReactNode; ratio?: number; defaultRatio?: number;
  onRatioChange?: (ratio: number) => void; firstLabel?: string; secondLabel?: string;
  height?: number | string;
}
export declare function SplitPane(props: SplitPaneProps): ReactNode;
