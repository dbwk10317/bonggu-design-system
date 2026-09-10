import type { HTMLAttributes, ReactNode } from "react";
/** JSON/코드 입력. 줄번호·mono·Tab 들여쓰기, JSON 실시간 유효성. 학습 config·run input. */
export interface CodeEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  /** JSON이 유효하면 파싱 결과, 아니면 null */
  onValidChange?: (parsed: unknown | null) => void;
  language?: "json" | "yaml" | "text";
  rows?: number;
  lineNumbers?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  fit?: "flex" | "fixed";
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
  "aria-label"?: string;
}
export declare function CodeEditor(props: CodeEditorProps): ReactNode;
