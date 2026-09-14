import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
/** Wires label, hint and error to an input. Child inputs (TextField etc.) receive id and aria via context. */
export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  hint?: ReactNode;
  /** Replaces hint when present and marks the input aria-invalid */
  error?: ReactNode;
  required?: boolean;
  /** Set to choose the input id yourself */
  id?: string;
  children: ReactNode;
}
export declare const Field: ForwardRefExoticComponent<FieldProps & RefAttributes<HTMLDivElement>>;
export declare function useFieldContext(): { id: string; describedBy?: string; invalid: boolean; required: boolean } | null;
