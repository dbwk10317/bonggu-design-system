import React from "react";
import { cx } from "../core/frame.js";

const SZ = { xs: 20, sm: 24, md: 32, lg: 40, xl: 56 };
const initials = (/** @type {string | undefined} */ n) => { if (!n) return "?"; const s = n.trim(); return /^[\uAC00-\uD7A3]/.test(s) ? s.slice(-2) : s.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(); };
const STATUS = { ok: "정상", warn: "주의", crit: "위험", off: "오프라인" };

/** User or service avatar. Without src, shows initials (last two characters for Korean names). status adds a presence dot, spelled out in the accessible name.
 * @param {Parameters<typeof import("./Avatar.d.ts").Avatar>[0]} props */
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

/** Overlapping avatar group; overflow beyond max renders +N.
 * @param {Parameters<typeof import("./Avatar.d.ts").AvatarGroup>[0]} props */
export function AvatarGroup({ users = [], max = 4, size = "sm", className }) {
  const px = typeof size === "number" ? size : SZ[size] ?? 24;
  const shown = users.slice(0, max), more = users.length - shown.length;
  return <span className={cx("bds-avatars", className)} style={{ "--av": px + "px" }}>{shown.map((u, i) => <Avatar key={i} size={px} {...u} />)}{more > 0 && <span className="bds-avatar bds-avatars__more" style={{ "--av": px + "px" }} aria-label={more + "명 더"}>+{more}</span>}</span>;
}
