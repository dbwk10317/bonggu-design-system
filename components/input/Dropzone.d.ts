import type { HTMLAttributes, ReactNode } from "react";
export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title?: ReactNode;
  hint?: ReactNode;
  icon?: string;
  /** flex=부모 폭(기본), fixed=width, auto=내용 크기 */
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
}
export declare function Dropzone(props: DropzoneProps): ReactNode;
