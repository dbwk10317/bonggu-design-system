import React, { createContext, useContext, useId } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

const FieldCtx = createContext(null);
export const useFieldContext = () => useContext(FieldCtx);

/** 라벨·설명·오류를 입력에 연결하는 래퍼. 자식 입력은 useFieldContext()로 id·aria를 받는다.
 * @param {Parameters<typeof import("./Field.d.ts").Field>[0]} props */
export function Field({ label, hint, error, required = false, id, className, children, ...rest }) {
  const auto = useId();
  const inputId = id ?? `f-${auto}`;
  const hintId = hint ? `${inputId}-h` : undefined;
  const errId = error ? `${inputId}-e` : undefined;
  const ctx = { id: inputId, describedBy: [hintId, errId].filter(Boolean).join(" ") || undefined, invalid: !!error, required };
  return (
    <FieldCtx.Provider value={ctx}>
      <div className={cx("bds-field", className)} {...rest}>
        {label != null && <label className="bds-field__label" htmlFor={inputId}>{label}{required && <span className="bds-field__req" aria-hidden="true">*</span>}</label>}
        {children}
        {hint && !error && <div id={hintId} className="bds-field__hint">{hint}</div>}
        {error && <div id={errId} className="bds-field__err" role="alert"><Icon name="warning-circle" size={13} />{error}</div>}
      </div>
    </FieldCtx.Provider>
  );
}
