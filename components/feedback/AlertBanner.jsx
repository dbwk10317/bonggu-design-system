import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";

const ICON = { info: "info", ok: "check-circle", warn: "warning", crit: "warning-octagon" };
/** 인라인 알림 배너. 페이지·섹션 단위 상태(수집 실패, 미구성). 토스트가 아니라 남아 있어야 하는 알림. warn·crit은 role="alert", 그 외는 role="status".
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
