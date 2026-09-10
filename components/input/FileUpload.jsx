import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { Dropzone } from "./Dropzone.jsx";
import { ProgressBar } from "../feedback/ProgressBar.jsx";
import { Button } from "../action/Button.jsx";

const fmtBytes = (/** @type {number | null | undefined} */ v) => { if (v == null) return ""; const u = ["B", "KiB", "MiB", "GiB"]; const e = Math.min(Math.floor(Math.log(v || 1) / Math.log(1024)), 3); const s = v / 1024 ** e; return `${s.toFixed(s >= 10 || e === 0 ? 0 : 1)} ${u[e]}`; };
const STATUS = { queued: ["대기", "off"], uploading: ["업로드 중", "accent"], paused: ["일시정지", "warn"], verifying: ["서버 검증 중", "accent"], done: ["완료", "ok"], failed: ["실패", "crit"] };
/** 청크 업로드 목록. Dropzone + 파일별 ProgressBar + 일시정지/재개/재시도/취소. 진행 상태는 부모가 items로 내려준다(업로드 로직은 컴포넌트 밖).
 * @param {Parameters<typeof import("./FileUpload.d.ts").FileUpload>[0]} props */
export function FileUpload({ items = [], accept, multiple = true, onFiles, onPause, onResume, onRetry, onCancel, title, hint, fit = "flex", width, className, style }) {
  return (
    <div className={cx("bds-upload", className)} style={frameStyle({ fit, width, style })}>
      <Dropzone accept={accept} multiple={multiple} onFiles={onFiles} title={title} hint={hint} icon="file-arrow-up" />
      {items.length > 0 && (
        <ul className="bds-upload__list" role="status" aria-live="polite">
          {items.map((it) => { const [label, tone] = STATUS[it.status] ?? STATUS.queued; const det = it.status === "uploading" || it.status === "paused"; return (
            <li key={it.id} className={cx("bds-upload__item", `bds-upload__item--${it.status}`)}>
              <Icon name={it.status === "done" ? "check-circle" : it.status === "failed" ? "warning-circle" : "file-zip"} size={18} className="bds-upload__ic" />
              <div className="bds-upload__main">
                <div className="bds-upload__hd"><b className="bds-ellipsis">{it.name}</b><span className="bds-upload__meta bds-mono">{fmtBytes(it.size)}{it.chunks ? ` · ${it.chunk ?? 0}/${it.chunks} 청크` : ""}{it.rate ? ` · ${it.rate}` : ""}</span></div>
                <ProgressBar size="sm" tone={/** @type {"accent" | "ok" | "warn" | "crit"} */ (tone)} value={it.status === "verifying" ? null : it.status === "done" ? 1 : it.progress ?? 0} showValue={det} label={<span className={cx("bds-upload__st", `bds-upload__st--${tone}`)}>{it.error ?? label}</span>} />
              </div>
              <div className="bds-upload__act">
                {it.status === "uploading" && onPause && <Button size="sm" variant="ghost" icon="pause" aria-label="일시정지" onClick={() => onPause(it.id)} />}
                {it.status === "paused" && onResume && <Button size="sm" variant="ghost" icon="play" aria-label="재개" onClick={() => onResume(it.id)} />}
                {it.status === "failed" && onRetry && <Button size="sm" variant="ghost" icon="arrow-counter-clockwise" aria-label="재시도" onClick={() => onRetry(it.id)} />}
                {it.status !== "done" && onCancel && <Button size="sm" variant="ghost" icon="x" aria-label="취소" onClick={() => onCancel(it.id)} />}
              </div>
            </li>
          ); })}
        </ul>
      )}
    </div>
  );
}
