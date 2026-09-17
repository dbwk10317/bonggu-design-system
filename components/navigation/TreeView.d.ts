/** @responsive */
import type { HTMLAttributes, ReactNode } from "react";
export interface TreeNode { id: string; label: string; children?: TreeNode[]; disabled?: boolean }
export interface TreeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  nodes: TreeNode[]; selectedId?: string | null; onSelect?: (id: string) => void;
  expandedIds?: string[]; defaultExpandedIds?: string[]; onExpandedChange?: (ids: string[]) => void;
  "aria-label"?: string;
}
export declare function TreeView(props: TreeViewProps): ReactNode;
