import React, { forwardRef, createContext, useContext, useId } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** @typedef {{ id: string, describedBy?: string, invalid: boolean, required: boolean }} FieldCtxValue */
/** @type {import("react").Context<FieldCtxValue | null>} */
const FieldCtx = createContext(/** @type {any} */ (null));
export const useFieldContext = () => useContext(FieldCtx);

/** Wires label, hint and error to an input. Child inputs read id and aria attributes via useFieldContext(). */
export const Field = forwardRef(
  /**
   * @param {import("./Field.d.ts").FieldProps} props
   * @param {import("react").ForwardedRef<HTMLDivElement>} ref
   */
  function Field({ label, hint, error, required = false, id, className, children, ...rest }, ref) {
  const auto = useId();
  const inputId = id ?? `f-${auto}`;
  const hintId = hint ? `${inputId}-h` : undefined;
  const errId = error ? `${inputId}-e` : undefined;
  const ctx = { id: inputId, describedBy: [hintId, errId].filter(Boolean).join(" ") || undefined, invalid: !!error, required };
  return (
    <FieldCtx.Provider value={ctx}>
      <div ref={ref} className={cx("bds-field", className)} {...rest}>
        {label != null && <label className="bds-field__label" htmlFor={inputId}>{label}{required && <span className="bds-field__req" aria-hidden="true">*</span>}</label>}
        {children}
        {hint && !error && <div id={hintId} className="bds-field__hint">{hint}</div>}
        {error && <div id={errId} className="bds-field__err" role="alert"><Icon name="warning-circle" size={13} />{error}</div>}
      </div>
    </FieldCtx.Provider>
  );
});
