import type { HTMLAttributes, ReactNode } from "react";
/** 구분선 */
export interface DividerProps extends HTMLAttributes<HTMLElement> {
  vertical?: boolean;
  /** 가운데 라벨(예: "또는") */
  label?: ReactNode;
}
export declare function Divider(props: DividerProps): ReactNode;
