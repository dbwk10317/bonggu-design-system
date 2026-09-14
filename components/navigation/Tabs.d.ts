import type { HTMLAttributes, ReactNode } from "react";
export interface TabItem { value: string; label: ReactNode; count?: number; icon?: string }
/** In-page view tabs. Single tab stop with arrow/Home/End roving; overflow scrolls horizontally. */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** Maps a tab value to its panel id; when given, each tab gets aria-controls. */
  panelId?: (value: string) => string;
  "aria-label"?: string;
}
export declare function Tabs(props: TabsProps): ReactNode;
