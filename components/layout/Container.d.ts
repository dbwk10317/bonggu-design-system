import type { HTMLAttributes, ReactNode } from "react";
/** 최대 폭 중앙 컨테이너 */
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** 760px 폭(설정·폼 페이지) */
  narrow?: boolean;
  /** 좌우 --page-pad 패딩 */
  pad?: boolean;
  children?: ReactNode;
}
export declare function Container(props: ContainerProps): JSX.Element;
