import React, { useEffect, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 2~5개 상호배타 선택. 선택 thumb가 미끄러진다. fit="flex"면 옵션이 폭을 균등 분할.
 * @param {Parameters<typeof import("./SegmentedControl.d.ts").SegmentedControl>[0]} props */
export function SegmentedControl({ options = [], value, onChange, size = "md", fit = "auto", width, className, style, "aria-label": ariaLabel, ...rest }) {
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
    <div ref={root} role="radiogroup" aria-label={ariaLabel} className={cx("bds-seg", size === "sm" && "bds-seg--sm", fit === "flex" && "bds-seg--flex", className)} style={frameStyle({ fit, width, style })} {...rest}>
      {thumb && <span className="bds-seg__thumb" style={thumb} aria-hidden="true" />}
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className="bds-seg__opt" disabled={o.disabled}
          tabIndex={o.value === (value ?? options.find((x) => !x.disabled)?.value) ? 0 : -1}
          onClick={() => onChange?.(o.value)}
          onKeyDown={(e) => {
            const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
            if (!dir) return;
            /* 화살표는 페이지를 스크롤시키지 않는다. 선택과 포커스를 함께 옮겨야 낭독이 따라온다. */
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
}
