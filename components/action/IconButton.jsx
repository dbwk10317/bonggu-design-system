import React, { forwardRef } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "./Icon.jsx";

/** 아이콘 전용 버튼. aria-label 필수. badge(숫자)가 0보다 크면 우상단 카운트가 붙고 접근 가능한 이름에 "N건"이 더해진다. */
export const IconButton = forwardRef(function IconButton({ icon, size = "md", variant = "outline", badge = 0, className, children, type = "button", ...rest }, ref) {
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
