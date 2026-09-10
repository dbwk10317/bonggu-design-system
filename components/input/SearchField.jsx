import React, { useEffect, useRef } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 검색 입력. `/` 단축키로 포커스, 값이 있으면 지우기 버튼. onSearch(value)는 Enter에 호출.
 * @param {Parameters<typeof import("./SearchField.d.ts").SearchField>[0]} props */
export function SearchField({ value, onChange, onSearch, placeholder = "검색", shortcut = true, size = "md", fit = "flex", width, className, style, "aria-label": ariaLabel = "검색", ...rest }) {
  const ref = useRef(/** @type {HTMLInputElement | null} */ (null));
  /* .d.ts 가 InputHTMLAttributes 를 상속하므로 onKeyDown 은 타입상 합법이다. 뒤에 펼치면
     Enter→onSearch 와 Esc→비우기가 조용히 죽는다. 빼내어 함께 부른다(NumberStepper 와 같은 방식). */
  const { onKeyDown, ...inputProps } = rest;
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (/** @type {KeyboardEvent} */ e) => { if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName ?? "")) { e.preventDefault(); ref.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcut]);
  return (
    <div className={cx("bds-ctl bds-search", size === "sm" && "bds-ctl--sm", className)} style={frameStyle({ fit, width, style })} role="search">
      <span className="bds-ctl__affix"><Icon name="magnifying-glass" size={15} /></span>
      <input ref={ref} type="search" value={value} onChange={(e) => onChange?.(e.target.value, e)} placeholder={placeholder} aria-label={ariaLabel}
        {...inputProps} onKeyDown={(e) => { onKeyDown?.(e); if (e.defaultPrevented) return; if (e.key === "Enter") onSearch?.(e.currentTarget.value); if (e.key === "Escape") onChange?.("", e); }} />
      {value ? <button type="button" className="bds-ctl__affix" aria-label="검색어 지우기" onClick={(e) => onChange?.("", e)}><Icon name="x-circle" size={15} /></button>
        : shortcut && <span className="bds-ctl__affix bds-ctl__kbd" aria-hidden="true">/</span>}
    </div>
  );
}
