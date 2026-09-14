import React, { useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** Tabs. items: {value,label,count?,icon?}[]. Single tab stop with arrow/Home/End roving; panelId(value) adds aria-controls. Ink bar slides under the selected tab; overflow scrolls horizontally.
 * @param {Parameters<typeof import("./Tabs.d.ts").Tabs>[0]} props */
export function Tabs({ items = [], value, onChange, panelId, className, "aria-label": ariaLabel, ...rest }) {
  const root = useRef(/** @type {HTMLDivElement | null} */ (null)), uid = useId().replace(/:/g, "");
  const [ink, setInk] = useState(/** @type {{ left: number, width: number } | null} */ (null));
  useEffect(() => {
    const el = /** @type {HTMLElement | null} */ (root.current?.querySelector('[aria-selected="true"]'));
    if (!el) { setInk(null); return; }
    const measure = () => setInk({ left: el.offsetLeft, width: el.offsetWidth });
    measure();
    const ro = new ResizeObserver(measure); if (root.current) ro.observe(root.current);
    return () => ro.disconnect();
  }, [value, items.length]);
  const move = (/** @type {import("react").KeyboardEvent<HTMLElement>} */ e) => {
    const i = items.findIndex((x) => x.value === value), n = items.length;
    const j = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault(); onChange?.(items[j].value);
    document.getElementById(`${uid}-tab-${items[j].value}`)?.focus();
  };
  return (
    <div ref={root} role="tablist" aria-label={ariaLabel} className={cx("bds-tabs", className)} {...rest}>
      {items.map((t) => (
        <button key={t.value} type="button" role="tab" id={`${uid}-tab-${t.value}`} aria-selected={t.value === value} aria-controls={panelId ? panelId(t.value) : undefined} tabIndex={t.value === value ? 0 : -1}
          className="bds-tabs__tab" onClick={() => onChange?.(t.value)} onKeyDown={move}>
          {t.icon && <Icon name={t.icon} size={14} />}{t.label}
          {t.count != null && <span className="bds-tabs__count">{t.count}</span>}
        </button>
      ))}
      {ink && <span className="bds-tabs__ink" style={ink} aria-hidden="true" />}
    </div>
  );
}
