import React from "react";
import { cx } from "../core/frame.js";
import { toneVar } from "./chart-math.js";

/* Swatch color: explicit color wins; series numbers, semantic keys and meter tones map to tokens, info/signal to state tokens, any other string is taken as a CSS color. */
const swatchColor = (/** @type {import("./Legend.d.ts").LegendItem} */ it, /** @type {number} */ i) => it.color ?? (typeof it.tone === "string" && !/^(rx|tx|used|reserved|free|ok|warn|crit)$/.test(it.tone) ? (/^(info|signal)$/.test(it.tone) ? `var(--${it.tone})` : it.tone) : toneVar(it.tone, i));

/** Standalone legend. items: {label, color?(CSS color), tone?(series number or semantic key), value?, dash?(line pattern), shape?, hidden?}.
 *  shape="line" draws a line swatch honoring dash; square/dot draw a square or a dot. onToggle makes items clickable; compact is the small variant used inside Chart.
 * @param {Parameters<typeof import("./Legend.d.ts").Legend>[0]} props
 */
export function Legend({ items = [], shape = "square", vertical = false, compact = false, onToggle, className, ...rest }) {
  const Tag = onToggle ? "button" : "span";
  return (
    <ul className={cx("bds-legend", vertical && "bds-legend--vertical", compact && "bds-legend--compact", className)} {...rest}>
      {items.map((it, i) => {
        const sh = it.shape ?? shape, color = swatchColor(it, i);
        const sw = sh === "line"
          ? <svg className="bds-legend__sw-line" width="14" height="8" viewBox="0 0 14 8" aria-hidden="true"><line x1="0" y1="4" x2="14" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray={it.dash || undefined} /></svg>
          : <i className={cx("bds-legend__sw", sh === "dot" && "bds-legend__sw--dot")} style={{ "--legend-color": color }} aria-hidden="true" />;
        return <li key={i}><Tag type={onToggle ? "button" : undefined} className={cx("bds-legend__i", it.hidden && "bds-legend__i--off")} aria-pressed={onToggle ? !it.hidden : undefined} onClick={onToggle ? () => onToggle(i, it) : undefined}>{sw}{it.label}{it.value != null && <span className="bds-legend__v">{it.value}</span>}</Tag></li>;
      })}
    </ul>
  );
}
