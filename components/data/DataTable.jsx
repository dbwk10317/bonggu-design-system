import React, { Fragment, useId, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";
import { Icon } from "../action/Icon.jsx";
import { Checkbox } from "../input/Checkbox.jsx";

const TABLE_DESKTOP_HIDE = "bds-table__d-hide";
const TABLE_MOBILE_HIDE = "bds-table__m-hide";
const hideCls = (/** @type {import("./DataTable.d.ts").DataTableColumn<any>} */ c) => (c.hideBelow === "desktop" ? TABLE_DESKTOP_HIDE : c.hideBelow === "tablet" ? TABLE_MOBILE_HIDE : undefined);

/* Missing-value check for one cell. Without render, row[key] is a value and core/missing.js applies.
   With render, the result is a ReactNode: null means "render nothing" (e.g. no button on a revoked-token row), not missing;
   only a returned MISSING_TEXT counts. See RULE.md "데이터와 결측". */
const cellOf = (/** @type {import("./DataTable.d.ts").DataTableColumn<any>} */ c, /** @type {any} */ row, /** @type {number} */ i) => {
  const v = c.render ? c.render(row, i) : row[c.key];
  const na = c.render ? v === MISSING_TEXT : isMissing(v);
  return { value: na ? MISSING_TEXT : v, na };
};

/** Data table. Columns hide by container width (hideBelow); hidden detail is reached through expandable.
 *  Sorting is display only; the consumer sorts rows. Missing cells follow RULE.md "데이터와 결측".
 * @param {Parameters<typeof import("./DataTable.d.ts").DataTable>[0]} props
 */
export function DataTable({ columns = [], rows = [], rowKey, rowLabel, sort, onSortChange, selectable = false, selectedKeys = [], onSelectionChange, bulkActions, expandable, defaultExpandedKeys = [], header, empty = "표시할 항목이 없습니다.", fit = "flex", width, height, className, style, "aria-label": ariaLabel, ...rest }) {
  const [expanded, setExpanded] = useState(() => new Set(defaultExpandedKeys));
  const autoId = useId(), hid = header?.id ?? autoId;
  /* Row identity is a value, not a position (see RULE.md "데이터와 결측"): after sort/filter the same
     index points at another record and selection sticks to the wrong row. Warn when identity is missing. */
  const keyOf = rowKey ?? ((/** @type {any} */ r, /** @type {number} */ i) => r.id ?? i);
  if ((selectable || expandable) && !rowKey && rows.some((r) => /** @type {any} */ (r)?.id == null)) {
    console.warn("DataTable: 선택·펼침에는 rowKey나 row.id로 행의 신원을 주어야 합니다. 위치는 정렬·필터에서 다른 행을 가리킵니다.");
  }
  const keys = rows.map((r, i) => keyOf(r, i));
  /* Expansion only means something for rows that still exist. Left alone the set grows for the life of the
     list, and a reused key would show a different row pre-expanded. Filter once at the read site. */
  const openKeys = expandable ? keys.filter((k) => expanded.has(k)) : [];
  /* Hide class and numeric alignment depend on the column only; computing per row would cost rows × columns. */
  const colCls = columns.map((c) => cx(c.align === "num" && "bds-table__num", hideCls(c)));
  const sel = new Set(selectedKeys);
  const selCount = keys.filter((k) => sel.has(k)).length;
  const all = rows.length > 0 && selCount === rows.length;
  const colCount = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);
  const toggle = (/** @type {Iterable<any>} */ set, /** @type {any} */ k) => { const n = new Set(set); n.has(k) ? n.delete(k) : n.add(k); return [...n]; };
  const requestSort = (/** @type {string} */ key) => onSortChange?.(sort?.key === key ? { key, dir: sort.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  return (
    <div className={cx("bds-table", className)} style={frameStyle({ fit, width, height, style })} {...rest}>
      {header && <div className="bds-table__hd"><h2 id={hid}>{header.title}</h2>{header.meta != null && <span>{header.meta}</span>}</div>}
      <div className="bds-table__wrap" style={height ? { overflow: "auto", minHeight: 0 } : undefined}>
        {selectable && selCount > 0 && <div className="bds-table__bulk"><b>{selCount}개 선택됨</b>{bulkActions}<button type="button" className="bds-table__clear" onClick={() => onSelectionChange?.([])}>선택 해제</button></div>}
        <div className="bds-table__scroll" tabIndex={0} role="region" aria-label={ariaLabel ?? "표"}>
          <table aria-label={ariaLabel} aria-labelledby={!ariaLabel && header ? hid : undefined}>
            <thead><tr>
              {selectable && <th scope="col" className="bds-table__check"><Checkbox aria-label="전체 선택" checked={all} indeterminate={selCount > 0 && !all} onChange={() => onSelectionChange?.(all ? [] : keys)} /></th>}
              {expandable && <th scope="col" className="bds-table__check" />}
              {columns.map((c) => {
                const sorted = sort?.key === c.key;
                return <th key={c.key} scope="col" style={c.width != null ? { width: c.width } : undefined} className={cx(c.align === "num" && "bds-table__num", sorted && "bds-table__sorted", hideCls(c))}
                  aria-sort={c.sortable ? (sorted ? (sort.dir === "asc" ? "ascending" : "descending") : "none") : undefined}>
                  {c.sortable ? <button type="button" className="bds-table__sort" onClick={() => requestSort(c.key)}>{c.header}{sorted && <Icon name={sort.dir === "asc" ? "caret-up" : "caret-down"} size={10} />}</button> : c.header}
                </th>;
              })}
            </tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={colCount} className="bds-table__empty">{empty}</td></tr>}
              {rows.map((row, i) => {
                const k = keys[i], isSel = sel.has(k), open = openKeys.includes(k), name = rowLabel ? rowLabel(row) : String(k);
                return (
                  <Fragment key={k}>
                    <tr className={cx(isSel && "bds-table__sel")}>
                      {selectable && <td className="bds-table__check"><Checkbox aria-label={`${name} 선택`} checked={isSel} onChange={() => onSelectionChange?.(toggle(selectedKeys, k))} /></td>}
                      {expandable && <td className="bds-table__check"><button type="button" className="bds-table__exp" aria-expanded={open} aria-label={`${name} 행 펼치기`} onClick={() => setExpanded((p) => new Set(toggle(p, k)))}><Icon name="caret-right" size={12} /></button></td>}
                      {columns.map((c, ci) => { const { value, na } = cellOf(c, row, i); return <td key={c.key} className={cx(colCls[ci], na && MISSING_CLASS)}>{value}</td>; })}
                    </tr>
                    {expandable && open && <tr className="bds-table__exprow"><td colSpan={colCount}>{expandable(row)}</td></tr>}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
