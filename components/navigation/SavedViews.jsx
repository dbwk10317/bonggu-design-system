import React, { useState } from "react";
import { cx } from "../core/frame.js";
import { Select } from "../input/Select.jsx";
import { TextField } from "../input/TextField.jsx";
import { Button } from "../action/Button.jsx";

/** @param {import("./SavedViews.d.ts").SavedViewsProps<any>} props */
export function SavedViews({ items = [], value, selectedId, onApply, onSave, onDelete, onRename, className, ...rest }) {
  const [name, setName] = useState("");
  const selected = items.find(item => item.id === selectedId);
  return <div className={cx("bds-saved-views", "bds-explore-tools", className)} {...rest}>
    <Select aria-label="저장된 보기" value={selected?.id ?? ""} options={[{ value: "", label: "보기 선택", disabled: true }, ...items.map(item => ({ value: item.id, label: item.name }))]} onChange={e => { const next = items.find(item => item.id === e.target.value); if (next) onApply?.(next); }} />
    <TextField aria-label="보기 이름" placeholder="보기 이름" value={name} onChange={e => setName(e.target.value)} />
    <Button variant="secondary" disabled={!name.trim()} onClick={() => { onSave?.(name.trim(), value); setName(""); }}>저장</Button>
    {onRename && <Button variant="ghost" disabled={!selected || !name.trim()} onClick={() => { if (selected) onRename(selected.id, name.trim()); setName(""); }}>이름 변경</Button>}
    {onDelete && <Button variant="ghost" disabled={!selected} onClick={() => { if (selected) onDelete(selected.id); }}>삭제</Button>}
  </div>;
}
