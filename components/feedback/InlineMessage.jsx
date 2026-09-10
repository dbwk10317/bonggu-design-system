import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

const ICON = { ok: "check-circle", warn: "warning", crit: "warning-circle", info: "info", neutral: "info" };
/** 필드 아래·카드 안 한 줄 메시지. 페이지 수준은 AlertBanner, 일시 알림은 Toast.
 * @param {Parameters<typeof import("./InlineMessage.d.ts").InlineMessage>[0]} props */
export function InlineMessage({ tone = "neutral", icon, className, children, ...rest }) {
  return <div className={cx("bds-msg", tone !== "neutral" && "bds-msg--" + tone, className)} role={tone === "crit" ? "alert" : "status"} {...rest}><Icon name={icon ?? ICON[tone]} size={14} /><span>{children}</span></div>;
}
