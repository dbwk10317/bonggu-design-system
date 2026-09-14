import React, { forwardRef } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "./Icon.jsx";

/** Icon-only button; aria-label is required. A badge > 0 renders a top-right count and appends "N건" to the accessible name, so callers must not add the count themselves. See RULE.md "접근성". */
export const IconButton = forwardRef(
  /**
   * @param {import("./IconButton.d.ts").IconButtonProps} props
   * @param {import("react").ForwardedRef<HTMLButtonElement>} ref
   */
  function IconButton({ icon, size = "md", variant = "outline", badge = 0, className, children, type = "button", ...rest }, ref) {
  if (!rest["aria-label"]) console.warn("IconButton: aria-label은 필수입니다.");
  const count = badge > 99 ? "99+" : badge;
  const label = badge > 0 && rest["aria-label"] ? `${rest["aria-label"]}, ${count}건` : rest["aria-label"];
  return (
    <button ref={ref} type={type} className={cx("bds-iconbtn", size !== "md" && `bds-iconbtn--${size}`, variant !== "outline" && `bds-iconbtn--${variant}`, className)} {...rest} aria-label={label}>
      {icon ? <Icon name={icon} size={size === "sm" ? 14 : size === "lg" ? 20 : 16} /> : children}
      {badge > 0 && <span className="bds-iconbtn__badge" aria-hidden="true">{count}</span>}
    </button>
  );
});
