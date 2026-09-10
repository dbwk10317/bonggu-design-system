import React from "react";
import { cx } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";

/* 세그먼트마다 배열을 새로 만들면 상태 페이지에서 막대 하나에 수십 번 버려진다. */
const TONES = ["ok", "warn", "crit"];

/** 가용성 막대(일/시간 단위 90칸). segments: {status: ok|warn|crit|off, label?}. 비율은 ok+warn 기준으로 계산해 텍스트로 병기.
 *  칸의 off는 상태 넷 중 하나(그 구간이 수집되지 않음)이고 문구는 같은 MISSING_TEXT를 쓴다.
 *  다만 칸의 표기는 텍스트가 아니라 track 색이므로 .bds-na를 붙이지 않는다. 헤더 비율만 결측 문구로 표시한다.
 *  좁은 컨테이너에서는 칸 간격과 최소폭을 줄여 모든 구간을 내부 폭에 맞춘다.
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
