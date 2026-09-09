import React from "react";
import { cx } from "../core/frame.js";
import { MascotMark } from "../brand/MascotMark.jsx";

/** 스피너. size px. label이 있으면 옆에 텍스트(권장). mascot=true면 봉구 얼굴이 돈다(md 이상). */
export function Spinner({ size = 18, label, mascot = false, className, ...rest }) {
  const el = mascot ? <span className="bds-spinner bds-spinner--mascot" style={{ width: size, height: size }} aria-hidden="true"><MascotMark face="blank" size={size} animated={false} /></span>
    : <span className={cx("bds-spinner", className)} style={{ width: size, height: size }} aria-hidden="true" />;
  return <span className="bds-spinner-row" role="status" aria-live="polite" aria-label={label ?? "불러오는 중"} {...rest}>{el}{label && <span>{label}</span>}</span>;
}
