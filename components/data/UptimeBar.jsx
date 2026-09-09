import React from "react";
import { cx } from "../core/frame.js";

/** 가용성 막대(일/시간 단위 90칸). segments: {status: ok|warn|crit|off, label?}. 비율은 ok+warn 기준으로 계산해 텍스트로 병기. */
export function UptimeBar({ name, segments = [], start, end, height = 28, uptime, className, ...rest }) {
  const known = segments.filter((s) => s.status !== "off");
  const pct = uptime ?? (known.length ? (known.filter((s) => s.status === "ok").length / known.length) * 100 : null);
  return (
    <div className={cx("bds-uptime", className)} style={{ "--uh": height + "px" }} {...rest}>
      {(name || pct != null) && <div className="bds-uptime__hd">{name && <b>{name}</b>}<span className="bds-uptime__pct">{pct == null ? "수집 안 됨" : pct.toFixed(pct >= 99.95 ? 3 : 2) + "%"}</span></div>}
      <div className="bds-uptime__bars" role="img" aria-label={(name ? name + " " : "") + segments.length + "칸 가용성"}>
        {segments.map((s, i) => <span key={i} className={cx("bds-uptime__b", "bds-uptime__b--" + (s.status ?? "off"))} title={s.label ?? ({ ok: "정상", warn: "일부 지연", crit: "장애", off: "수집 안 됨" }[s.status ?? "off"])} />)}
      </div>
      {(start || end) && <div className="bds-uptime__ft"><span>{start}</span><span>{end}</span></div>}
    </div>
  );
}
