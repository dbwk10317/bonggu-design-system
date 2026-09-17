import React, { useEffect, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { MISSING_CLASS, isMissing } from "../core/missing.js";

// Lowercase export keeps this implementation detail out of the public component manifest.
export const plotValue = function PlotValue(
  /** @type {{ value: string, caption?: import("react").ReactNode, unit?: string, box: { left: number, top: number, width: number, height: number }, metrics: import("./plot-layout.js").PlotMetrics, tone?: string }} */
  { value, caption, unit, box, metrics: m, tone },
) {
  const ref = useRef(/** @type {HTMLSpanElement | null} */ (null));
  const [captionText, setCaptionText] = useState(typeof caption === "string" ? caption : "");
  useEffect(() => { setCaptionText(ref.current?.textContent ?? ""); }, [caption]);
  const missing = isMissing(value), text = value + (unit ? ` ${unit}` : "");
  const available = Math.max(0, box.width - 2 * m.gap);
  const valueHeight = box.height - 2 * m.gap - (captionText ? m.caption * m.snug + m.gap : 0);
  const fontSize = Math.min(m.max, valueHeight / m.snug, available / (m.measure(text, missing, 1, !missing) || 1));
  const fits = m.max > 0 && fontSize >= m.min && m.measure(captionText, true) <= available && fontSize * m.snug + (captionText ? m.caption * m.snug + m.gap : 0) <= box.height - 2 * m.gap;
  return <div role={fits ? undefined : "region"} aria-label={fits ? undefined : "측정값"} tabIndex={fits ? undefined : 0} className={cx("bds-plot-value", fits && "bds-plot-value--inside")} style={{ "--value-size": `${fits ? fontSize : m.max}px`, "--tone-ink": tone, ...(fits ? { left: box.left, top: box.top, width: box.width, height: box.height } : {}) }}>
    <b className={missing ? MISSING_CLASS : undefined}>{value}{unit && <small> {unit}</small>}</b>
    {caption != null && <span ref={ref}>{caption}</span>}
  </div>;
};
