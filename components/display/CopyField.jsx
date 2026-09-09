import React, { useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 복사 전용 값(토큰·식별자·curl). 읽기 전용 mono + 복사 버튼. multiline이면 <pre>. secret이면 마스킹 + 보기 토글. */
export function CopyField({ value, label, multiline = false, secret = false, copyLabel = "복사", copiedLabel = "복사됨", onCopy, fit = "flex", width, className, style }) {
  const [copied, setCopied] = useState(false);
  const [shown, setShown] = useState(!secret);
  const copy = async () => { try { await navigator.clipboard.writeText(value); setCopied(true); onCopy?.(true); setTimeout(() => setCopied(false), 1600); } catch { onCopy?.(false); } };
  const disp = shown ? value : "•".repeat(Math.min(32, value.length));
  return (
    <div className={cx("bds-copy", multiline && "bds-copy--multi", className)} style={frameStyle({ fit, width, style })}>
      {label && <span className="bds-copy__l">{label}</span>}
      <div className="bds-copy__box">
        {multiline ? <pre className="bds-copy__v bds-mono">{disp}</pre> : <code className="bds-copy__v bds-mono bds-ellipsis" title={shown ? value : undefined}>{disp}</code>}
        <div className="bds-copy__act">
          {secret && <button type="button" className="bds-copy__btn" aria-label={shown ? "숨기기" : "보기"} aria-pressed={shown} onClick={() => setShown((s) => !s)}><Icon name={shown ? "eye-slash" : "eye"} size={14} /></button>}
          <button type="button" className={cx("bds-copy__btn", copied && "bds-copy__btn--ok")} onClick={copy}><Icon name={copied ? "check" : "copy"} size={14} /><span>{copied ? copiedLabel : copyLabel}</span></button>
          <span className="bds-sr" role="status">{copied ? copiedLabel : ""}</span>
        </div>
      </div>
    </div>
  );
}
