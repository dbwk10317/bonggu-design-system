import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
export interface ComboOption { value: string; label: string; detail?: ReactNode; disabled?: boolean }
/** Searchable single select for lists that grow (models, revisions, users). */
export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: ComboOption[];
  value: string | null;
  onChange: (value: string | null, option: ComboOption | null) => void;
  placeholder?: string;
  emptyText?: ReactNode;
  size?: "sm" | "md";
  fit?: "flex" | "fixed";
  width?: number | string;
  disabled?: boolean;
  invalid?: boolean;
  /** Accessibility state overriding Field.required. Validating the selected value on submit is the form's job. */
  required?: boolean;
  clearable?: boolean;
  "aria-label"?: string;
}
export declare const Combobox: ForwardRefExoticComponent<ComboboxProps & RefAttributes<HTMLInputElement>>;
