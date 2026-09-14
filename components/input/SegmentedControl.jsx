import React, { forwardRef, useEffect, useRef, useState } from "react";
import { assignRef, cx, frameStyle } from "../core/frame.js";

/** 2–5 mutually exclusive options with a sliding thumb. fit="flex" splits the width evenly. */
export const SegmentedControl = forwardRef(
  /**
   * @param {import("./SegmentedControl.d.ts").SegmentedControlProps} props
   * @param {import("react").ForwardedRef<HTMLDivElement>} ref
   */
  function SegmentedControl({ options = [], value, onChange, size = "md", fit = "auto", width, className, style, "aria-label": ariaLabel, ...rest }, ref) {
  const root = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [thumb, setThumb] = useState(/** @type {{ left: number, width: number } | null} */ (null));
  useEffect(() => {
    const el = /** @type {HTMLElement | null} */ (root.current?.querySelector('[aria-checked="true"]'));
    if (!el || !root.current) { setThumb(null); return; }
    const measure = () => setThumb({ left: el.offsetLeft, width: el.offsetWidth });
    measure();
    const ro = new ResizeObserver(measure); ro.observe(root.current);
    return () => ro.disconnect();
  }, [value, options.length]);
  return (
    <div ref={(el) => { root.current = el; assignRef(ref, el); }} role="radiogroup" aria-label={ariaLabel} className={cx("bds-seg", size === "sm" && "bds-seg--sm", fit === "flex" && "bds-seg--flex", className)} style={frameStyle({ fit, width, style })} {...rest}>
      {thumb && <span className="bds-seg__thumb" style={thumb} aria-hidden="true" />}
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className="bds-seg__opt" disabled={o.disabled}
          tabIndex={o.value === (value ?? options.find((x) => !x.disabled)?.value) ? 0 : -1}
          onClick={() => onChange?.(o.value)}
          onKeyDown={(e) => {
            const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
            if (!dir) return;
            /* Arrows must not scroll the page. Move selection and focus together or the screen reader keeps reading the old item. */
            e.preventDefault();
            const i = options.findIndex((x) => x.value === value);
            const next = options[(i + dir + options.length) % options.length];
            onChange?.(next.value);
            /** @type {HTMLElement | null | undefined} */
            (e.currentTarget.parentElement?.querySelector(`[data-seg-value="${next.value}"]`))?.focus();
          }}
          data-seg-value={o.value}>
          {o.label}
        </button>
      ))}
    </div>
  );
});
