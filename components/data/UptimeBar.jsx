import React from "react";
import { cx } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";

/* Hoisted: rebuilding this array per segment would allocate dozens of times per bar on a status page. */
const TONES = ["ok", "warn", "crit"];

/** Availability bar (90 day/hour cells). segments: {status: ok|warn|crit|off, label?}. The percentage is computed from ok+warn and shown as text.
 *  off cells are missing intervals: they share MISSING_TEXT via title but not .bds-na, because a cell is a track color, not text. See RULE.md "데이터와 결측".
 * @param {Parameters<typeof import("./UptimeBar.d.ts").UptimeBar>[0]} props
 */
export function UptimeBar({ name, segments = [], start, end, height = 28, uptime, className, ...rest }) {
  const known = segments.filter((s) => TONES.includes(s.status));
  const raw = uptime ?? (known.length ? (known.filter((s) => s.status === "ok" || s.status === "warn").length / known.length) * 100 : null);
  const na = isMissing(raw), pct = na ? null : raw;
  return (
    <div className={cx("bds-uptime", className)} style={{ "--uh": height + "px" }} {...rest}>
      {(name || pct != null) && <div className="bds-uptime__hd">{name && <b>{name}</b>}<span className={cx("bds-uptime__pct", na && MISSING_CLASS)}>{na || pct == null ? MISSING_TEXT : pct.toFixed(pct >= 99.95 ? 3 : 2) + "%"}</span></div>}
      <div className="bds-uptime__bars" role="img" aria-label={(name ? name + " " : "") + segments.length + "칸 가용성"}>
        {segments.map((s, i) => <span key={i} className={cx("bds-uptime__b", "bds-uptime__b--" + (s.status ?? "off"))} title={s.label ?? ({ ok: "정상", warn: "일부 지연", crit: "장애", off: MISSING_TEXT }[s.status ?? "off"])} />)}
      </div>
      {(start || end) && <div className="bds-uptime__ft"><span>{start}</span><span>{end}</span></div>}
    </div>
  );
}
