import React, { useEffect, useMemo, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { numeric } from "../core/missing.js";

/** @typedef {{ height: number, tiles: { index: number, width: number }[] }} JustifiedRow */

/** Row packing for JustifiedGallery. See RULE.md "동작 계약" (데이터와 결측).
 * @param {{ width: number | null, height: number | null }[]} items @param {number} width @param {number} target @param {number} gap
 * @returns {JustifiedRow[]} */
export function justifyRows(items, width, target, gap) {
  if (!(width > 0) || !items.length) return [];
  const ratios = items.map((item) => {
    const w = numeric(item.width), h = numeric(item.height);
    return w != null && h != null && w > 0 && h > 0 ? w / h : 1;
  });
  /** @type {JustifiedRow[]} */
  const rows = [];
  /** @param {number} start @param {number} end @param {number} h @param {boolean} fill */
  const push = (start, end, h, fill) => {
    const tiles = [];
    let used = 0;
    for (let i = start; i <= end; i++) {
      const w = Math.max(1, Math.round(h * ratios[i]));
      tiles.push({ index: i, width: w });
      used += w;
    }
    if (fill) tiles[tiles.length - 1].width += width - gap * (end - start) - used;
    rows.push({ height: Math.round(h), tiles });
  };
  let start = 0, sum = 0;
  for (let i = 0; i < ratios.length; i++) {
    sum += ratios[i];
    const n = i - start + 1;
    const h = (width - gap * (n - 1)) / sum;
    if (h > target) continue;
    // Close the row at whichever height, with or without this photo, lands closer to the target.
    const without = n > 1 ? (width - gap * (n - 2)) / (sum - ratios[i]) : Infinity;
    if (n > 1 && Math.abs(without - target) < Math.abs(h - target)) {
      push(start, i - 1, without, true);
      start = i;
      sum = ratios[i];
    } else {
      push(start, i, h, true);
      start = i + 1;
      sum = 0;
    }
  }
  if (start < ratios.length) push(start, ratios.length - 1, Math.min(target, (width - gap * (ratios.length - start - 1)) / sum), false);
  return rows;
}

/* Wider containers show more, shorter rows; tiers follow the --cq-lg / --cq-xl container widths. */
/** @param {number} w */
const autoRowHeight = (w) => Math.round(Math.min(190, Math.max(84, w / (w >= 900 ? 7 : w >= 640 ? 5.5 : 3.6))));

/** Photo list keeping original aspect ratios; tiles are sized from the measured width and the CSS gap token.
 * @param {Parameters<typeof import("./JustifiedGallery.d.ts").JustifiedGallery>[0]} props */
export function JustifiedGallery({ items, rowHeight, onOpen, footer, fit = "flex", width, className, style, ...rest }) {
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [box, setBox] = useState({ w: 0, gap: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth, gap = parseFloat(getComputedStyle(el).rowGap) || 0;
      setBox((p) => (p.w === w && p.gap === gap ? p : { w, gap }));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const rows = useMemo(() => justifyRows(items, box.w, rowHeight ?? autoRowHeight(box.w), box.gap), [items, box, rowHeight]);
  return (
    <div ref={ref} role="group" className={cx("bds-jgal", className)} style={frameStyle({ fit, width, style })} {...rest}>
      {rows.map((row) => (
        <div key={row.tiles[0].index} className="bds-jgal__row">
          {row.tiles.map(({ index, width: w }) => {
            const item = items[index];
            const size = { width: w, height: row.height };
            return onOpen
              ? <button key={item.id} type="button" className="bds-jgal__tile" style={size} aria-label={`${item.alt} 상세보기`} onClick={() => onOpen(item, index)}><img src={item.src} alt="" loading="lazy" decoding="async" /></button>
              : <div key={item.id} className="bds-jgal__tile" style={size}><img src={item.src} alt={item.alt} loading="lazy" decoding="async" /></div>;
          })}
        </div>
      ))}
      {footer != null && <div className="bds-jgal__foot">{footer}</div>}
    </div>
  );
}
