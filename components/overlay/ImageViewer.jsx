import React, { useState } from "react";
import { Modal } from "./Modal.jsx";
import { Button } from "../action/Button.jsx";
import { IconButton } from "../action/IconButton.jsx";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";

/** @param {import("./ImageViewer.d.ts").ImageViewerProps} props */
export function ImageViewer({ open, onClose, images = [], index, onIndexChange, "aria-label": ariaLabel = "이미지 뷰어" }) {
  const [local, setLocal] = useState(0), [zoom, setZoom] = useState(1);
  const active = Math.min(Math.max(0, Number.isFinite(index ?? local) ? Math.trunc(index ?? local) : 0), Math.max(0, images.length - 1));
  const current = images[active];
  const identity = open && current ? `${current.id}\n${current.src}` : "";
  const [shown, setShown] = useState(identity), [status, setStatus] = useState("loading");
  if (shown !== identity) { setShown(identity); setZoom(1); setStatus("loading"); }
  const move = (/** @type {number} */ next) => { const n = Math.min(images.length - 1, Math.max(0, next)); setLocal(n); onIndexChange?.(n); };
  const scale = (/** @type {number} */ next) => setZoom(Math.max(1, Math.min(8, next)));
  return <Modal open={open} onClose={onClose} title={current?.title ?? ariaLabel} size="xl" className="bds-imageviewer" onKeyDown={e => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
    if (e.key === "+" || e.key === "=") scale(zoom * 1.25);
    else if (e.key === "-") scale(zoom / 1.25);
    else if (e.key === "0") setZoom(1);
    else if (e.key === "ArrowLeft" && zoom === 1) move(active - 1);
    else if (e.key === "ArrowRight" && zoom === 1) move(active + 1);
    else return;
    e.preventDefault();
  }}>
    <div className="bds-explore-tools">
      <IconButton icon="caret-left" aria-label="이전 이미지" disabled={active === 0 || !images.length} onClick={() => move(active - 1)} />
      <span role="status">{images.length ? `${active + 1} / ${images.length}` : "이미지 없음"}</span>
      <IconButton icon="caret-right" aria-label="다음 이미지" disabled={active >= images.length - 1} onClick={() => move(active + 1)} />
      <IconButton icon="magnifying-glass-minus" aria-label="축소" disabled={zoom <= 1 || !current} onClick={() => scale(zoom / 1.25)} />
      <span className="bds-mono">{Math.round(zoom * 100)}%</span>
      <IconButton icon="magnifying-glass-plus" aria-label="확대" disabled={zoom >= 8 || !current} onClick={() => scale(zoom * 1.25)} />
      <Button variant="ghost" disabled={!current} onClick={() => setZoom(1)}>화면 맞춤</Button>
    </div>
    <div className="bds-imageviewer__viewport" role="region" aria-label="이미지 확대 영역" tabIndex={0}>
      {current ? <div className="bds-imageviewer__canvas" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
        <img key={identity} src={current.src} alt={current.alt} onLoad={() => setStatus("ready")} onError={() => setStatus("error")} />
      </div> : <p>표시할 이미지가 없습니다.</p>}
    </div>
    {current && status !== "ready" && <p className="bds-imageviewer__message" role="status">{status === "error" ? "이미지를 불러오지 못했습니다." : "이미지 로딩 중"}</p>}
    {!!current?.metadata?.length && <dl className="bds-imageviewer__metadata" role="region" aria-label="이미지 정보" tabIndex={0}>{current.metadata.map((item, i) => <div key={i}><dt>{item.label}</dt><dd className={isMissing(item.value) ? MISSING_CLASS : undefined}>{isMissing(item.value) ? MISSING_TEXT : item.value}</dd></div>)}</dl>}
  </Modal>;
}
