import type { HTMLAttributes, ReactNode } from "react";
/** 오른쪽 상세 패널. 네이티브 <dialog>로 렌더되어 포커스가 안에 갇힌다. 목록 맥락을 유지하며 상세를 본다. 결정(삭제·저장)은 Modal. */
export interface DrawerProps extends HTMLAttributes<HTMLDialogElement> {
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
