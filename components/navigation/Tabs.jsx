import React, { useEffect, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 탭. items: {value,label,count?,icon?}[]. 잉크바가 선택 탭 아래로 미끄러진다. 넘치면 가로 스크롤. */
export function Tabs({ items = [], value, onChange, className, "aria-label": ariaLabel, ...rest }) {
  const root = useRef(null);
  const [ink, setInk] = useState(null);
  useEffect(() => {
    const el = root.current?.querySelector('[aria-selected="true"]');
    if (!el) return;
    const measure = () => setInk({ left: el.offsetLeft, width: el.offsetWidth });
    measure();
    const ro = new ResizeObserver(measure); ro.observe(root.current);
    return () => ro.disconnect();
  }, [value, items.length]);
  return (
    <div ref={root} role="tablist" aria-label={ariaLabel} className={cx("bds-tabs", className)} {...rest}>
      {items.map((t) => (
        <button key={t.value} type="button" role="tab" aria-selected={t.value === value} className="bds-tabs__tab" onClick={() => onChange?.(t.value)}
          onKeyDown={(e) => { const i = items.findIndex((x) => x.value === value); if (e.key === "ArrowRight") onChange?.(items[(i + 1) % items.length].value); if (e.key === "ArrowLeft") onChange?.(items[(i - 1 + items.length) % items.length].value); }}>
          {t.icon && <Icon name={t.icon} size={14} />}{t.label}
          {t.count != null && <span className="bds-tabs__count">{t.count}</span>}
        </button>
      ))}
      {ink && <span className="bds-tabs__ink" style={ink} aria-hidden="true" />}
    </div>
  );
}
