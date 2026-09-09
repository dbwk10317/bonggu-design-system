import React, { useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { useFieldContext } from "./Field.jsx";

const HEX = /^#?([0-9a-f]{6})$/i;
/** 색 선택: 스와치(네이티브 picker) + hex 입력 + 프리셋 칩. 값은 #RRGGBB. 조명(ARGB) 색 지정용 — UI 토큰 색이 아니다. */
export function ColorInput({ value, defaultValue = "#5CA8FF", presets = [], size = "md", fit = "flex", width, disabled, invalid, onChange, className, style, "aria-label": ariaLabel }) {
  const f = useFieldContext();
  const [inner, setInner] = useState(defaultValue);
  const [text, setText] = useState(null);
  const v = value ?? inner;
  const set = (hex) => { const m = HEX.exec(hex.trim()); if (!m) return false; const out = `#${m[1].toUpperCase()}`; setInner(out); onChange?.(out); return true; };
  return (
    <div className={cx("bds-color", size === "sm" && "bds-color--sm", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      <div className={cx("bds-ctl bds-color__ctl", size === "sm" && "bds-ctl--sm", (invalid ?? f?.invalid) && "bds-ctl--err")}>
        <label className="bds-color__swatch" style={{ background: v }} aria-label={ariaLabel ?? "색 선택"}><input type="color" value={v} disabled={disabled} onChange={(e) => set(e.target.value)} /></label>
        <input id={f?.id} aria-describedby={f?.describedBy} className="bds-mono" spellCheck={false} maxLength={7} value={text ?? v} disabled={disabled}
          onChange={(e) => setText(e.target.value)} onBlur={() => { if (text != null) { set(text); setText(null); } }} onKeyDown={(e) => { if (e.key === "Enter" && text != null) { set(text); setText(null); } }} />
      </div>
      {presets.length > 0 && <div className="bds-color__presets" role="group" aria-label="색 프리셋">{presets.map((p) => <button key={p} type="button" className={cx("bds-color__chip", p.toUpperCase() === v.toUpperCase() && "bds-color__chip--on")} style={{ background: p }} aria-label={`${p.toUpperCase()} 적용`} aria-pressed={p.toUpperCase() === v.toUpperCase()} disabled={disabled} onClick={() => set(p)} />)}</div>}
    </div>
  );
}
