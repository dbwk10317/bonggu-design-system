import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title?: ReactNode;
  hint?: ReactNode;
  icon?: string;
  /** flex = parent width (default), fixed = width, auto = content size */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
}
export declare const Dropzone: ForwardRefExoticComponent<DropzoneProps & RefAttributes<HTMLDivElement>>;
