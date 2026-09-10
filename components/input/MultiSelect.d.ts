import type { HTMLAttributes, ReactNode } from "react";
export interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  /** 최대 선택 수 */
  max?: number;
  fit?: "flex" | "fixed" | "auto";
  width?: number | string;
  disabled?: boolean;
  className?: string;
  style?: any;
}
export declare function MultiSelect(props: MultiSelectProps): ReactNode;
