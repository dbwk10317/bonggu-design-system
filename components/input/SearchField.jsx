import React, { forwardRef, useEffect, useRef } from "react";
import { assignRef, cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** Search input. `/` shortcut focuses it; a clear button appears when there is a value. onSearch(value) fires on Enter. */
export const SearchField = forwardRef(
  /**
   * @param {import("./SearchField.d.ts").SearchFieldProps} props
   * @param {import("react").ForwardedRef<HTMLInputElement>} ref
   */
  function SearchField({ value, onChange, onSearch, placeholder = "검색", shortcut = true, size = "md", fit = "flex", width, className, style, "aria-label": ariaLabel = "검색", ...rest }, ref) {
  const input = useRef(/** @type {HTMLInputElement | null} */ (null));
  /* The .d.ts extends InputHTMLAttributes, so onKeyDown is legal. Spread after ours it would silently
     kill Enter→onSearch and Esc→clear; pull it out and call both (same approach as NumberStepper). */
  const { onKeyDown, ...inputProps } = rest;
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (/** @type {KeyboardEvent} */ e) => { if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName ?? "")) { e.preventDefault(); input.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcut]);
  return (
    <div className={cx("bds-ctl bds-search", size === "sm" && "bds-ctl--sm", className)} style={frameStyle({ fit, width, style })} role="search">
      <span className="bds-ctl__affix"><Icon name="magnifying-glass" size={15} /></span>
      <input ref={(el) => { input.current = el; assignRef(ref, el); }} type="search" value={value} onChange={(e) => onChange?.(e.target.value, e)} placeholder={placeholder} aria-label={ariaLabel}
        {...inputProps} onKeyDown={(e) => { onKeyDown?.(e); if (e.defaultPrevented) return; if (e.key === "Enter") onSearch?.(e.currentTarget.value); if (e.key === "Escape") onChange?.("", e); }} />
      {value ? <button type="button" className="bds-ctl__affix" aria-label="검색어 지우기" onClick={(e) => onChange?.("", e)}><Icon name="x-circle" size={15} /></button>
        : shortcut && <span className="bds-ctl__affix bds-ctl__kbd" aria-hidden="true">/</span>}
    </div>
  );
});
