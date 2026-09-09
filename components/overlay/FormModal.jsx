import React from "react";
import { Modal } from "./Modal.jsx";
import { Button } from "../action/Button.jsx";

/** 폼 모달. Enter 제출, 제출 버튼 라벨은 동사. busy 중 취소도 막는다. */
export function FormModal({ open, onClose, onSubmit, title, description, submitLabel = "저장", cancelLabel = "취소", busy = false, danger = false, size = "md", error, children }) {
  return (
    <Modal open={open} onClose={busy ? undefined : onClose} title={title} description={description} size={size}
      actions={<><Button variant="ghost" disabled={busy} onClick={onClose}>{cancelLabel}</Button><Button variant={danger ? "danger" : "primary"} type="submit" form="bds-form-modal" busy={busy}>{submitLabel}</Button></>}>
      <form id="bds-form-modal" style={{ display: "grid", gap: 14, minWidth: 0 }} onSubmit={(e) => { e.preventDefault(); if (!busy) onSubmit?.(e); }}>
        {children}
        {error && <div className="bds-field__err" role="alert">{error}</div>}
      </form>
    </Modal>
  );
}
