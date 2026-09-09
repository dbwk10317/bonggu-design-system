import React, { useState } from "react";
import { Modal } from "../overlay/Modal.jsx";
import { Button } from "../action/Button.jsx";
import { TextField } from "../input/TextField.jsx";

/** 확인 모달. danger면 확인 버튼 crit 채움. typeToConfirm에 이름을 주면 그대로 입력해야 확인이 활성화된다. */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "확인", cancelLabel = "취소", danger = false, typeToConfirm, busy = false, size = "sm" }) {
  const [typed, setTyped] = useState("");
  const ok = !typeToConfirm || typed === typeToConfirm;
  return (
    <Modal open={open} onClose={onClose} title={title} size={size} closeButton={false}
      actions={<><Button variant="ghost" onClick={onClose} disabled={busy}>{cancelLabel}</Button><Button variant={danger ? "danger" : "primary"} className={danger ? "bds-btn--danger-fill" : undefined} disabled={!ok} busy={busy} onClick={() => onConfirm?.()}>{confirmLabel}</Button></>}>
      {message && <p className="bds-confirm__msg">{message}</p>}
      {typeToConfirm && <label className="bds-confirm__typed"><span>계속하려면 <code>{typeToConfirm}</code>을(를) 입력합니다</span><TextField mono value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus /></label>}
    </Modal>
  );
}
