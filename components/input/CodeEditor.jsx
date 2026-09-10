import React, { useMemo, useRef } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

/** JSON/코드 입력. 줄번호 + mono + Tab 들여쓰기. language="json"이면 파싱해 오류 위치를 아래에 표시하고 onValidChange(obj|null)를 부른다.
 * @param {Parameters<typeof import("./CodeEditor.d.ts").CodeEditor>[0]} props */
export function CodeEditor({ value, defaultValue = "", onChange, onValidChange, language = "json", rows = 8, lineNumbers = true, readOnly, placeholder, fit = "flex", width, height, disabled, className, style, "aria-label": ariaLabel }) {
  const f = useFieldContext();
  const [inner, setInner] = React.useState(defaultValue);
  const v = value ?? inner;
  const ta = useRef(/** @type {HTMLTextAreaElement | null} */ (null)), gutter = useRef(/** @type {HTMLPreElement | null} */ (null));
  const lines = useMemo(() => v.split("\n").length, [v]);
  const err = useMemo(() => {
    if (language !== "json" || !v.trim()) return null;
    try { const o = JSON.parse(v); onValidChange?.(o); return null; }
    catch (e) { onValidChange?.(null); const m = /position (\d+)/.exec(e.message); let line = null; if (m) { line = v.slice(0, Number(m[1])).split("\n").length; } return { line, message: e.message.replace(/^JSON\.parse: |^Unexpected token.*?in JSON at position \d+$/, (s) => s).replace("JSON.parse: ", "") }; }
  }, [v, language]);
  const set = (/** @type {string} */ s) => { setInner(s); onChange?.(s); };
  const onKey = (/** @type {import("react").KeyboardEvent<HTMLTextAreaElement>} */ e) => {
    /* Tab은 들여쓰기, Shift+Tab은 가로채지 않아 키보드로 빠져나갈 수 있다 */
    if (e.key === "Tab" && !e.shiftKey && !readOnly) { e.preventDefault(); const t = e.currentTarget, s = t.selectionStart, en = t.selectionEnd; const next = v.slice(0, s) + "  " + v.slice(en); set(next); requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2; }); }
  };
  return (
    <div className={cx("bds-code-ed", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, height, style })}>
      <div className={cx("bds-ctl bds-ctl--area bds-code-ed__box", (err || f?.invalid) && "bds-ctl--err")}>
        {lineNumbers && <pre ref={gutter} className="bds-code-ed__gutter bds-mono" aria-hidden="true">{Array.from({ length: lines }, (_, i) => <span key={i} className={cx(err?.line === i + 1 && "bds-code-ed__ln--err")}>{i + 1}</span>)}</pre>}
        <textarea ref={ta} id={f?.id} aria-describedby={f?.describedBy} aria-label={ariaLabel} aria-invalid={!!err || undefined} className="bds-mono" rows={rows} spellCheck={false} wrap="off" readOnly={readOnly} disabled={disabled} placeholder={placeholder} value={v}
          onChange={(e) => set(e.target.value)} onKeyDown={onKey} onScroll={(e) => { if (gutter.current) gutter.current.scrollTop = e.currentTarget.scrollTop; }} />
      </div>
      <div className="bds-code-ed__foot">
        <span className="bds-mono">{language.toUpperCase()} · {lines}줄</span>
        {err ? <span className="bds-code-ed__msg" role="alert"><Icon name="warning-circle" size={13} />{err.line ? `${err.line}번째 줄: ` : ""}{err.message}</span> : language === "json" && v.trim() ? <span className="bds-code-ed__ok"><Icon name="check" size={13} />유효한 JSON</span> : null}
      </div>
    </div>
  );
}
