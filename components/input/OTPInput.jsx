import React, { useRef } from "react";
import { cx } from "../core/frame.js";
import { useFieldContext } from "./Field.jsx";

/** 인증 코드(OTP) 입력. length 자리 숫자, 붙여넣기 지원, 다 채우면 onComplete. */
export function OTPInput({ length = 6, value = "", onChange, onComplete, group = 3, invalid, disabled, className }) {
  const f = useFieldContext();
  const refs = useRef([]);
  const chars = Array.from({ length }, (_, i) => value[i] === " " ? "" : value[i] ?? "");
  const commit = (next) => { const v = next.slice(0, length).replace(/ +$/, ""); onChange?.(v); if (v.length === length && !/\D/.test(v)) onComplete?.(v); };
  const onInput = (i, e) => { const d = e.target.value.replace(/\D/g, ""); const arr = chars.slice(); arr[i] = d ? d[d.length - 1] : ""; commit(arr.map((c) => c || " ").join("")); if (d) refs.current[Math.min(length - 1, i + 1)]?.focus(); };
  const onKey = (i, e) => {
    if (e.key === "Backspace") { e.preventDefault(); const arr = chars.slice(); if (arr[i]) arr[i] = ""; else if (i > 0) { arr[i - 1] = ""; refs.current[i - 1]?.focus(); } commit(arr.map((c) => c || " ").join("")); }
    else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };
  const onPaste = (e) => { const d = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, length); if (!d) return; e.preventDefault(); commit(d); refs.current[Math.min(length - 1, d.length)]?.focus(); };
  return (
    <div className={cx("bds-otp", (invalid ?? f?.invalid) && "bds-otp--err", className)} role="group" aria-label="인증 코드" aria-describedby={f?.describedBy}>
      {chars.map((c, i) => <React.Fragment key={i}>{group && i > 0 && i % group === 0 && <span className="bds-otp__sep" aria-hidden="true" />}<input ref={(el) => (refs.current[i] = el)} id={i === 0 ? f?.id : undefined} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={2} value={c} disabled={disabled} aria-label={(i + 1) + "번째 자리"} onChange={(e) => onInput(i, e)} onKeyDown={(e) => onKey(i, e)} onPaste={onPaste} onFocus={(e) => e.target.select()} /></React.Fragment>)}
    </div>
  );
}
