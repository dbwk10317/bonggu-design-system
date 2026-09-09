import React from "react";
import { cx } from "../core/frame.js";

const SZ = { xs: 20, sm: 24, md: 32, lg: 40, xl: 56 };
const initials = (n) => { if (!n) return "?"; const s = n.trim(); return /^[가-힣]/.test(s) ? s.slice(-2) : s.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(); };
const STATUS = { ok: "정상", warn: "주의", crit: "위험", off: "오프라인" };

/** 사용자·서비스 아바타. src 없으면 이름 이니셜(한글은 뒤 두 글자). status로 온라인 점(접근 가능한 이름에 텍스트로 병기). */
export function Avatar({ name, src, size = "md", square = false, status, className, style, ...rest }) {
  const px = typeof size === "number" ? size : SZ[size] ?? 32;
  const label = name && status ? `${name}, ${STATUS[status] ?? status}` : name;
  return (
    <span className={cx("bds-avatar", square && "bds-avatar--square", className)} style={{ "--av": px + "px", ...style }} title={label} aria-label={label} role="img" {...rest}>
      {src ? <img className="bds-avatar__img" src={src} alt="" /> : <span aria-hidden="true">{initials(name)}</span>}
      {status && <i className={cx("bds-avatar__st", "bds-avatar__st--" + status)} aria-hidden="true" />}
    </span>
  );
}

/** 겹친 아바타 묶음. max 초과는 +N. */
export function AvatarGroup({ users = [], max = 4, size = "sm", className }) {
  const px = typeof size === "number" ? size : SZ[size] ?? 24;
  const shown = users.slice(0, max), more = users.length - shown.length;
  return <span className={cx("bds-avatars", className)} style={{ "--av": px + "px" }}>{shown.map((u, i) => <Avatar key={i} size={px} {...u} />)}{more > 0 && <span className="bds-avatar bds-avatars__more" style={{ "--av": px + "px" }} aria-label={more + "명 더"}>+{more}</span>}</span>;
}
