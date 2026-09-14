import type { ReactElement, ReactNode } from "react";
export interface MenuItem { label: ReactNode; icon?: string; onSelect?: () => void; danger?: boolean; disabled?: boolean; shortcut?: string }
/** "…" menu that folds three or more row actions. Dangerous actions go last, after a separator. */
export interface DropdownMenuProps {
  items: (MenuItem | "-")[];
  /** Defaults to a dots-three IconButton */
  trigger?: ReactElement;
  align?: "start" | "end";
  size?: "sm" | "md";
  "aria-label"?: string;
  className?: string;
}
export declare function DropdownMenu(props: DropdownMenuProps): ReactNode;
