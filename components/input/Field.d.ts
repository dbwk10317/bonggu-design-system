import type { HTMLAttributes, ReactNode } from "react";
/** 라벨·설명·오류를 입력에 연결하는 래퍼. 자식 입력(TextField 등)은 컨텍스트로 id·aria를 받는다. */
export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  hint?: ReactNode;
  /** 있으면 hint 대신 표시되고 입력이 aria-invalid */
  error?: ReactNode;
  required?: boolean;
  /** 입력 id를 직접 정할 때 */
  id?: string;
  children: ReactNode;
}
export declare function Field(props: FieldProps): ReactNode;
export declare function useFieldContext(): { id: string; describedBy?: string; invalid: boolean; required: boolean } | null;
