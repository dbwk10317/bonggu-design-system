import React, { useId } from "react";
import { Modal } from "./Modal.jsx";
import { Button } from "../action/Button.jsx";

/** Form modal. Enter submits; the submit label is a verb. While busy, cancel is blocked too.
 * @param {Parameters<typeof import("./FormModal.d.ts").FormModal>[0]} props */
export function FormModal({ open, onClose, onSubmit, title, description, submitLabel = "저장", cancelLabel = "취소", busy = false, danger = false, size = "md", error, children }) {
  const formId = useId();
  return (
    <Modal open={open} onClose={busy ? undefined : onClose} closeButton={!busy} title={title} description={description} size={size}
      actions={<><Button variant="ghost" disabled={busy} onClick={onClose}>{cancelLabel}</Button>{submitLabel != null && <Button variant={danger ? "danger" : "primary"} type="submit" form={formId} busy={busy}>{submitLabel}</Button>}</>}>
      <form id={formId} style={{ display: "grid", gap: 14, minWidth: 0 }} onSubmit={(e) => { e.preventDefault(); if (!busy && submitLabel != null) onSubmit?.(e); }}>
        {children}
        {error && <div className="bds-field__err" role="alert">{error}</div>}
      </form>
    </Modal>
  );
}
