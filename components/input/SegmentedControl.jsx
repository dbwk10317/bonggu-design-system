import React, { useEffect, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 2~5개 상호배타 선택. 선택 thumb가 미끄러진다. fit="flex"면 옵션이 폭을 균등 분할. */
export function SegmentedControl({ options = [], value, onChange, size = "md", fit = "auto", width, className, style, "aria-label": ariaLabel, ...rest }) {
  const root = useRef(null);
  const [thumb, setThumb] = useState(null);
  useEffect(() => {
    const el = root.current?.querySelector('[aria-checked="true"]');
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
          onClick={() => onChange?.(o.value)}
          onKeyDown={(e) => { const i = options.findIndex((x) => x.value === value); if (e.key === "ArrowRight") onChange?.(options[(i + 1) % options.length].value); if (e.key === "ArrowLeft") onChange?.(options[(i - 1 + options.length) % options.length].value); }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
