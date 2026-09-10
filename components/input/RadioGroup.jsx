import React, { useId } from "react";
import { cx } from "../core/frame.js";
import { Checkbox } from "./Checkbox.jsx";

/** 라디오 묶음. options: {value, label, hint?, disabled?}. layout: column(기본) · row · cards(설명 있는 선택지).
 * @param {Parameters<typeof import("./RadioGroup.d.ts").RadioGroup>[0]} props */
export function RadioGroup({ name, value, onChange, options = [], label, layout = "column", disabled, className, ...rest }) {
  const uid = useId().replace(/:/g, ""), nm = name ?? "rg-" + uid;
  return (
    <fieldset className={cx("bds-radiogrp", layout === "row" && "bds-radiogrp--row", layout === "cards" && "bds-radiogrp--cards", className)} disabled={disabled} {...rest}>
      {label && <legend className="bds-radiogrp__lg">{label}</legend>}
      {options.map((o) => {
        const input = <Checkbox radio name={nm} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange?.(o.value)}>{layout === "cards" ? null : o.label}</Checkbox>;
        if (layout === "cards") return <label key={o.value} className="bds-radiocard">{input}<b>{o.label}</b>{o.hint && <small>{o.hint}</small>}</label>;
        return <div key={o.value} className="bds-radiogrp__opt">{input}{o.hint && <span className="bds-radiogrp__hint">{o.hint}</span>}</div>;
      })}
    </fieldset>
  );
}
