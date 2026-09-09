import type { HTMLAttributes, ReactNode } from "react";
/** 오른쪽 상세 패널. 목록 맥락을 유지하며 상세를 본다. 결정(삭제·저장)은 Modal. */
export interface DrawerProps extends HTMLAttributes<HTMLElement> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** sm 380 · md 480 · lg 640 */
  size?: "sm" | "md" | "lg";
  closeButton?: boolean;
  children?: ReactNode;
}
export declare function Drawer(props: DrawerProps): JSX.Element;
