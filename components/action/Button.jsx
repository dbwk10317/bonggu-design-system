import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "./Icon.jsx";

/** Button. variant is meaning (primary/secondary/ghost/danger), size is density, fit="flex" fills the parent width.
 * @param {Parameters<typeof import("./Button.d.ts").Button>[0]} props */
export function Button({ variant = "secondary", size = "md", fit = "auto", width, icon, iconRight, busy = false, disabled, className, children, type = "button", ...rest }) {
  return (
    <button type={type} disabled={disabled || busy} aria-busy={busy || undefined}
      className={cx("bds-btn", `bds-btn--${variant}`, size !== "md" && `bds-btn--${size}`, fit === "flex" && "bds-btn--flex", className)}
      style={fit === "fixed" ? frameStyle({ fit, width }) : undefined} {...rest}>
      {busy ? <span className="bds-btn__spin" aria-hidden="true" /> : icon ? <Icon name={icon} /> : null}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} />}
    </button>
  );
}
