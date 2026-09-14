import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";

const ICON = { info: "info", ok: "check-circle", warn: "warning", crit: "warning-octagon" };
/** Inline alert banner for page/section state (collection failure, not configured): a notice that must persist, unlike a toast. warn/crit use role="alert", others role="status".
 * @param {Parameters<typeof import("./AlertBanner.d.ts").AlertBanner>[0]} props */
export function AlertBanner({ tone = "info", title, onClose, className, children, ...rest }) {
  return (
    <div role={tone === "crit" || tone === "warn" ? "alert" : "status"} className={cx("bds-alert", `bds-tone--${tone}`, className)} {...rest}>
      <Icon name={ICON[tone]} />
      {title && <div className="bds-alert__t">{title}</div>}
      <div className="bds-alert__b">{children}</div>
      {onClose && <IconButton className="bds-alert__x" icon="x" size="sm" variant="ghost" aria-label="알림 닫기" onClick={onClose} />}
    </div>
  );
}
