import type { HTMLAttributes, ReactNode } from "react";
export type UploadStatus = "queued" | "uploading" | "paused" | "verifying" | "done" | "failed";
export interface UploadItem { id: string; name: string; size?: number; status: UploadStatus; /** 0~1 */ progress?: number; chunk?: number; chunks?: number; rate?: string; error?: string }
/** 청크 업로드(ZIP 프로젝트·Dataset). Dropzone + 파일별 진행 + 일시정지·재개·재시도·취소. 상태는 부모가 소유한다. */
export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
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
export declare function FileUpload(props: FileUploadProps): JSX.Element;
