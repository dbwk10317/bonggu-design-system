import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
export type UploadStatus = "queued" | "uploading" | "paused" | "verifying" | "done" | "failed";
export interface UploadItem { id: string; name: string; size?: number; status: UploadStatus; /** 0~1 */ progress?: number; chunk?: number; chunks?: number; rate?: string; error?: string }
/** Chunked upload (ZIP projects, datasets): Dropzone + per-file progress + pause/resume/retry/cancel. State is owned by the parent. */
export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onPause" | "onCancel"> {
  items: UploadItem[];
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  title?: ReactNode;
  hint?: ReactNode;
  fit?: "flex" | "fixed";
  width?: number | string;
}
export declare const FileUpload: ForwardRefExoticComponent<FileUploadProps & RefAttributes<HTMLDivElement>>;
