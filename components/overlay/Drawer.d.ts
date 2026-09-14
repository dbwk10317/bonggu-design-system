import type { HTMLAttributes, ReactNode } from "react";
/** Right-side detail panel on a native <dialog>, so focus stays inside. Shows detail while keeping the list in view; decisions (delete, save) belong in Modal. */
export interface DrawerProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title" | "onClose"> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** sm 380 · md 480 · lg 640 (px) */
  size?: "sm" | "md" | "lg";
  closeButton?: boolean;
  children?: ReactNode;
}
export declare function Drawer(props: DrawerProps): ReactNode;
