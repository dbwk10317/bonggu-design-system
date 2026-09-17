import { useEffect, useState } from "react";
import { estWidth } from "./chart-math.js";

/** Server geometry is provisional; browser layout uses resolved tokens and the loaded font.
 * @typedef {{ width: number, height: number, micro: number, caption: number, min: number, max: number, gap: number, snug: number, measure: (text: string, ui?: boolean, size?: number, bold?: boolean) => number }} PlotMetrics */
/** @type {PlotMetrics} */
export const emptyPlotMetrics = { width: 0, height: 0, micro: 0, caption: 0, min: 0, max: 0, gap: 0, snug: 1, measure: (text) => estWidth(text) };

/** @param {{ current: HTMLElement | null }} ref */
export function usePlotMetrics(ref) {
  const [metrics, setMetrics] = useState(emptyPlotMetrics);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const doc = el.ownerDocument;
    const context = doc.createElement("canvas").getContext("2d");
    let active = true;
    const read = () => {
      if (!active) return;
      const css = getComputedStyle(el);
      // Resolve CSS lengths through the browser, including rem/em and consumer token overrides.
      const probe = doc.createElement("span");
      probe.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;transition:none!important";
      el.append(probe);
      const size = (/** @type {string} */ token) => { probe.style.fontSize = `var(${token})`; return parseFloat(getComputedStyle(probe).fontSize); };
      const micro = size("--fs-micro"), caption = size("--fs-caption"), min = size("--fs-subheading"), max = size("--fs-title");
      probe.style.paddingLeft = "var(--sp-1)";
      const gap = parseFloat(getComputedStyle(probe).paddingLeft);
      probe.style.lineHeight = "var(--lh-snug)";
      const snug = parseFloat(getComputedStyle(probe).lineHeight) / max;
      probe.remove();
      const uiFont = css.getPropertyValue("--font-ui"), dataFont = css.getPropertyValue("--font-data");
      // DOMRect includes zoom/transforms; SVG coordinates and CSS text use layout pixels.
      setMetrics({ width: parseFloat(css.width) || 0, height: parseFloat(css.height) || 0, micro, caption, min, max, gap, snug,
        measure: (text, ui = false, fontSize = ui ? caption : micro, bold = false) => {
          if (!context) return estWidth(text);
          context.font = `${bold ? 700 : 400} ${fontSize}px ${ui ? uiFont : dataFont}`;
          // Data tracking is part of the measured width, not an assumed glyph count.
          context.letterSpacing = ui ? "0px" : `${fontSize * parseFloat(css.getPropertyValue("--ls-data") || "0")}px`;
          return context.measureText(text).width;
        },
      });
    };
    read();
    const observer = new ResizeObserver(read); observer.observe(el);
    const theme = new MutationObserver(read);
    for (let parent = /** @type {HTMLElement | null} */ (el); parent; parent = parent.parentElement) theme.observe(parent, { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-density"] });
    doc.fonts.ready.then(read);
    doc.fonts.addEventListener("loadingdone", read);
    return () => { active = false; observer.disconnect(); theme.disconnect(); doc.fonts.removeEventListener("loadingdone", read); };
  }, [ref]);
  return metrics;
}

/** @param {string} text */
export const plotLabelIsUI = (text) => !/^[\d\s:./%°+−-]+$/.test(text);

/** Place text within a row and drop colliding labels, including the last endpoint.
 * @param {Array<{ index: number, x: number, text: string, ui?: boolean }>} labels
 * @param {number} width @param {PlotMetrics} metrics */
export function plotLabels(labels, width, metrics) {
  let edge = 0;
  return labels.flatMap((label) => {
    const textWidth = metrics.measure(label.text, label.ui);
    if (textWidth > width) return [];
    const left = Math.max(0, Math.min(width - textWidth, label.x - textWidth / 2));
    if (left < edge) return [];
    edge = left + textWidth + metrics.gap;
    return [{ ...label, x: left, width: textWidth }];
  });
}
