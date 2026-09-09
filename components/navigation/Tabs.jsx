import React, { useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 탭. items: {value,label,count?,icon?}[]. 선택 탭만 Tab 순서에 들고 화살표·Home·End로 옮긴다. panelId(value)를 주면 aria-controls를 붙인다. 잉크바가 선택 탭 아래로 미끄러진다. 넘치면 가로 스크롤. */
export function Tabs({ items = [], value, onChange, panelId, className, "aria-label": ariaLabel, ...rest }) {
  const root = useRef(null), uid = useId().replace(/:/g, "");
  const [ink, setInk] = useState(null);
  useEffect(() => {
    const el = root.current?.querySelector('[aria-selected="true"]');
    if (!el) return;
    const measure = () => setInk({ left: el.offsetLeft, width: el.offsetWidth });
    measure();
    const ro = new ResizeObserver(measure); ro.observe(root.current);
    return () => ro.disconnect();
  }, [value, items.length]);
  const move = (e) => {
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
