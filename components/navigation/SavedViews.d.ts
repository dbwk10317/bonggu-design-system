/** @responsive */
import type { HTMLAttributes, ReactNode } from "react";
export interface SavedView<T = unknown> { id: string; name: string; value: T }
export interface SavedViewsProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: SavedView<T>[]; value: T; selectedId?: string | null;
  onApply: (view: SavedView<T>) => void; onSave: (name: string, value: T) => void;
  onDelete?: (id: string) => void; onRename?: (id: string, name: string) => void;
}
export declare function SavedViews<T = unknown>(props: SavedViewsProps<T>): ReactNode;
