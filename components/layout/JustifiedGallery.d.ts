import type { HTMLAttributes, ReactNode } from "react";
export interface JustifiedGalleryItem {
  /** Identity; tiles are keyed by it */
  id: string | number;
  src: string;
  /** Describes the photo. The tile's accessible name is built from it */
  alt: string;
  /** Original pixel size, used only for the aspect ratio. null = missing (laid out 1:1) */
  width: number | null;
  height: number | null;
}
/** Photo list that keeps each photo's original aspect ratio and fills every row but the last to the container width. */
export interface JustifiedGalleryProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: JustifiedGalleryItem[];
  /** Target row height in px. Omitted: derived from the container width */
  rowHeight?: number;
  /** When given, tiles are buttons that open the photo */
  onOpen?: (item: JustifiedGalleryItem, index: number) => void;
  /** Full-width slot under the last row (load more) */
  footer?: ReactNode;
  /** flex = parent width (default), fixed = width */
  fit?: "flex" | "fixed";
  width?: number | string;
  "aria-label"?: string;
}
export declare function JustifiedGallery(props: JustifiedGalleryProps): ReactNode;
