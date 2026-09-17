import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
/** JSON/code input: line numbers, mono, Tab indent, live JSON validation. For training configs and run inputs. */
export interface CodeEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  /** Parsed result when the JSON is valid, otherwise null */
  onValidChange?: (parsed: unknown | null) => void;
  language?: "json" | "yaml" | "text";
  rows?: number;
  lineNumbers?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
  "aria-label"?: string;
}
export declare const CodeEditor: ForwardRefExoticComponent<CodeEditorProps & RefAttributes<HTMLTextAreaElement>>;
