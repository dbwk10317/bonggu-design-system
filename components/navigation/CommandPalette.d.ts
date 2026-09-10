import type { HTMLAttributes, ReactNode } from "react";
export interface CommandItem { id: string; label: ReactNode; icon?: string; group?: string; hint?: ReactNode; keywords?: string; onSelect?: (item: CommandItem) => void; }
export interface CommandPaletteProps {
  open: boolean;
  onClose?: () => void;
  items: CommandItem[];
  placeholder?: string;
  /** 딤 없이 패널만(문서·임베드용) */
  inline?: boolean;
  className?: string;
}
export declare function CommandPalette(props: CommandPaletteProps): ReactNode;
