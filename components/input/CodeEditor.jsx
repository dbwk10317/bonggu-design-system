import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { assignRef, cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

/** JSON/code input: line numbers, mono, Tab indents. With language="json" it parses, shows the error line below and calls onValidChange(obj|null). */
export const CodeEditor = forwardRef(
  /**
   * @param {import("./CodeEditor.d.ts").CodeEditorProps} props
   * @param {import("react").ForwardedRef<HTMLTextAreaElement>} ref
   */
  function CodeEditor({ value, defaultValue = "", onChange, onValidChange, language = "json", rows = 8, lineNumbers = true, readOnly, placeholder, fit = "flex", width, height, disabled, className, style, "aria-label": ariaLabel }, ref) {
  const f = useFieldContext();
  const [inner, setInner] = React.useState(defaultValue);
  const v = value ?? inner;
  const ta = useRef(/** @type {HTMLTextAreaElement | null} */ (null)), gutter = useRef(/** @type {HTMLPreElement | null} */ (null));
  const lines = useMemo(() => v.split("\n").length, [v]);
  /* Parse during render, notify after commit. checked = "was this input subject to validation". */
  const parsed = useMemo(() => {
    if (language !== "json" || !v.trim()) return { checked: false, value: null, err: null };
    try { return { checked: true, value: JSON.parse(v), err: null }; }
    catch (e) { const msg = e instanceof Error ? e.message : String(e); const m = /position (\d+)/.exec(msg); let line = null; if (m) { line = v.slice(0, Number(m[1])).split("\n").length; } return { checked: true, value: null, err: { line, message: msg.replace(/^JSON\.parse: |^Unexpected token.*?in JSON at position \d+$/, (/** @type {string} */ s) => s).replace("JSON.parse: ", "") } }; }
  }, [v, language]);
  const err = parsed.err;
  /* The callback is usually a new function every render; as an effect dependency it would re-notify with an unchanged value. */
  const notifyValid = useRef(onValidChange);
  useEffect(() => { notifyValid.current = onValidChange; });
  useEffect(() => { if (parsed.checked) notifyValid.current?.(parsed.value); }, [parsed]);
  const set = (/** @type {string} */ s) => { setInner(s); onChange?.(s); };
  const onKey = (/** @type {import("react").KeyboardEvent<HTMLTextAreaElement>} */ e) => {
    /* Tab indents; Shift+Tab is left alone so keyboard users can leave the editor */
    if (e.key === "Tab" && !e.shiftKey && !readOnly) { e.preventDefault(); const t = e.currentTarget, s = t.selectionStart, en = t.selectionEnd; const next = v.slice(0, s) + "  " + v.slice(en); set(next); requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2; }); }
  };
  return (
    <div className={cx("bds-code-ed", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, height, style })}>
      <div className={cx("bds-ctl bds-ctl--area bds-code-ed__box", (err || f?.invalid) && "bds-ctl--err")}>
        {lineNumbers && <pre ref={gutter} className="bds-code-ed__gutter bds-mono" aria-hidden="true">{Array.from({ length: lines }, (_, i) => <span key={i} className={cx(err?.line === i + 1 && "bds-code-ed__ln--err")}>{i + 1}</span>)}</pre>}
        <textarea ref={(el) => { ta.current = el; assignRef(ref, el); }} id={f?.id} aria-describedby={f?.describedBy} aria-label={ariaLabel} aria-invalid={!!err || undefined} className="bds-mono" rows={rows} spellCheck={false} wrap="off" readOnly={readOnly} disabled={disabled} placeholder={placeholder} value={v}
          onChange={(e) => set(e.target.value)} onKeyDown={onKey} onScroll={(e) => { if (gutter.current) gutter.current.scrollTop = e.currentTarget.scrollTop; }} />
      </div>
      <div className="bds-code-ed__foot">
        <span className="bds-mono">{language.toUpperCase()} · {lines}줄</span>
        {err ? <span className="bds-code-ed__msg" role="alert"><Icon name="warning-circle" size={13} />{err.line ? `${err.line}번째 줄: ` : ""}{err.message}</span> : language === "json" && v.trim() ? <span className="bds-code-ed__ok"><Icon name="check" size={13} />유효한 JSON</span> : null}
      </div>
    </div>
  );
});
