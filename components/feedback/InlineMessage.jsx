import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

const ICON = { ok: "check-circle", warn: "warning", crit: "warning-circle", info: "info", neutral: "info" };
/** One-line message under a field or inside a card. Page-level notices are AlertBanner; transient ones are Toast.
 * @param {Parameters<typeof import("./InlineMessage.d.ts").InlineMessage>[0]} props */
export function InlineMessage({ tone = "neutral", icon, className, children, ...rest }) {
  return <div className={cx("bds-msg", tone !== "neutral" && "bds-msg--" + tone, className)} role={tone === "crit" ? "alert" : "status"} {...rest}><Icon name={icon ?? ICON[tone]} size={14} /><span>{children}</span></div>;
}
