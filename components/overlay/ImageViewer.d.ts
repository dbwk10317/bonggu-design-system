/** @responsive */
import type { ReactNode } from "react";
export interface ViewerImage { id: string; src: string; alt: string; title?: string; metadata?: { label: string; value: ReactNode }[] }
export interface ImageViewerProps {
  open: boolean; onClose?: () => void; images: ViewerImage[]; index?: number;
  onIndexChange?: (index: number) => void; "aria-label"?: string;
}
export declare function ImageViewer(props: ImageViewerProps): ReactNode;
