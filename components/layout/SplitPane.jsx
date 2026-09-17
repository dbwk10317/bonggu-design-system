import React, { useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";

/** @param {import("./SplitPane.d.ts").SplitPaneProps} props */
export function SplitPane({ first, second, ratio, defaultRatio = .35, onRatioChange, firstLabel = "목록", secondLabel = "상세", height, className, style, ...rest }) {
  const dividerFocused = useRef(false);
  const uid = useId(), ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [local, setLocal] = useState(defaultRatio), [stacked, setStacked] = useState(false);
  const value = Math.max(.1, Math.min(.9, Number.isFinite(ratio ?? local) ? (ratio ?? local) : .35));
  const change = (/** @type {number} */ next) => { const n = Math.max(.1, Math.min(.9, next)); setLocal(n); onRatioChange?.(n); };
  useEffect(() => { const el = ref.current; if (!el) return; const read = () => { const vertical = getComputedStyle(el).flexDirection === "column"; setStacked(vertical); if (vertical && dividerFocused.current) { dividerFocused.current = false; /** @type {HTMLElement | null} */ (el.querySelector(".bds-split__first"))?.focus(); } }; const observer = new ResizeObserver(read); observer.observe(el); read(); return () => observer.disconnect(); }, []);
  const move = (/** @type {import("react").PointerEvent<HTMLDivElement>} */ e) => { const box = ref.current?.getBoundingClientRect(); if (box && box.width) change((e.clientX - box.left) / box.width); };
  return <div className={cx("bds-split", className)} style={{ height, ...style }} {...rest}><div ref={ref} className="bds-split__layout" style={{ "--split-ratio": value }}>
    <div id={`${uid}-first`} className="bds-split__first" role="region" aria-label={firstLabel} tabIndex={0}>{first}</div>
    <div role="separator" aria-label={`${firstLabel} 영역 크기`} aria-controls={`${uid}-first`} aria-orientation="vertical" aria-valuemin={10} aria-valuemax={90} aria-valuenow={Math.round(value * 100)} tabIndex={stacked ? -1 : 0} className="bds-split__handle" onFocus={() => { dividerFocused.current = true; }} onBlur={e => { if (e.relatedTarget) dividerFocused.current = false; }} onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e); }} onPointerUp={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) { move(e); e.currentTarget.releasePointerCapture(e.pointerId); } }} onKeyDown={e => { if (e.key === "ArrowLeft") change(value - .05); else if (e.key === "ArrowRight") change(value + .05); else if (e.key === "Home") change(.1); else if (e.key === "End") change(.9); else return; e.preventDefault(); }} />
    <div className="bds-split__second" role="region" aria-label={secondLabel} tabIndex={0}>{second}</div>
  </div></div>;
}
