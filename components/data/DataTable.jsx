import React, { Fragment, useEffect, useId, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";
import { Icon } from "../action/Icon.jsx";
import { Button } from "../action/Button.jsx";
import { IconButton } from "../action/IconButton.jsx";
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
export function DataTable({ columns: sourceColumns = [], columnState, onColumnStateChange, columnSettings = false, rows = [], rowKey, rowLabel, sort, onSortChange, selectable = false, selectedKeys = [], onSelectionChange, bulkActions, expandable, defaultExpandedKeys = [], header, empty = "표시할 항목이 없습니다.", fit = "flex", width, height, className, style, "aria-label": ariaLabel, ...rest }) {
  const [localColumns, setLocalColumns] = useState(/** @type {import("./DataTable.d.ts").TableColumnState[]} */ ([]));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pinOffsets, setPinOffsets] = useState(/** @type {Record<string, number>} */ ({}));
  const tableRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const state = columnState ?? localColumns;
  const configuredLayout = columnSettings || columnState !== undefined || localColumns.length > 0;
  const keysInOrder = [...new Set([...state.map(c => c.key), ...sourceColumns.map(c => c.key)])];
  const configured = keysInOrder.flatMap(key => { const source = sourceColumns.find(c => c.key === key); return source ? [{ ...source, hideBelow: configuredLayout ? undefined : source.hideBelow, ...state.find(c => c.key === key) }] : []; });
  const shown = configured.filter(c => !c.hidden);
  const columns = (shown.length ? shown : configured.slice(0, 1)).slice().sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
  const signature = JSON.stringify(columns.map(c => [c.key, c.width, c.pinned]));
  useEffect(() => {
    const root = tableRef.current, scroll = root?.querySelector('.bds-table__scroll'); if (!root || !scroll) return;
    const heads = [...root.querySelectorAll('th[data-column]')];
    const read = () => {
      const pinned = heads.filter(el => el.getAttribute("data-pinned") === "true");
      const total = pinned.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
      /** @type {Record<string, number>} */ const offsets = {}; let left = 0;
      if (total < scroll.clientWidth * .65) for (const el of pinned) { offsets[el.getAttribute("data-column") ?? ""] = left; left += el.getBoundingClientRect().width; }
      setPinOffsets(prev => JSON.stringify(prev) === JSON.stringify(offsets) ? prev : offsets);
    };
    const observer = new ResizeObserver(read); observer.observe(scroll); heads.forEach(el => observer.observe(el)); read(); return () => observer.disconnect();
  }, [signature, rows, settingsOpen]);
  const updateColumns = (/** @type {import("./DataTable.d.ts").TableColumnState[]} */ next) => { setLocalColumns(next); onColumnStateChange?.(next); };
  const changeColumn = (/** @type {string} */ key, /** @type {Partial<import("./DataTable.d.ts").TableColumnState>} */ patch) => updateColumns(configured.map(c => ({ key: c.key, hidden: c.hidden, width: typeof c.width === "number" ? c.width : undefined, pinned: c.pinned, ...(c.key === key ? patch : {}) })));
  const moveColumn = (/** @type {string} */ key, /** @type {number} */ direction) => { const next = configured.map(c => ({ key: c.key, hidden: c.hidden, width: typeof c.width === "number" ? c.width : undefined, pinned: c.pinned })); const i = next.findIndex(c => c.key === key), target = i + direction; if (target >= 0 && target < next.length) { [next[i], next[target]] = [next[target], next[i]]; updateColumns(next); } };
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
    <div ref={tableRef} className={cx("bds-table", className)} style={frameStyle({ fit, width, height, style })} {...rest}>
      {header && <div className="bds-table__hd"><h2 id={hid}>{header.title}</h2>{header.meta != null && <span>{header.meta}</span>}</div>}
      {columnSettings && <div className="bds-table__preferences">
        <Button variant="secondary" size="sm" icon="columns" aria-expanded={settingsOpen} aria-controls={`${autoId}-columns`} onClick={() => setSettingsOpen(!settingsOpen)}>열 설정</Button>
        {settingsOpen && <div id={`${autoId}-columns`} className="bds-table__settings" role="region" aria-label="열 설정" tabIndex={0}>
          {configured.map((c, i) => <div key={c.key} className="bds-table__setting">
            <Checkbox checked={columns.some(col => col.key === c.key)} disabled={columns.length === 1 && columns[0].key === c.key} onChange={e => changeColumn(c.key, { hidden: !e.target.checked })}>{c.header}</Checkbox>
            <Checkbox checked={!!c.pinned} onChange={e => changeColumn(c.key, { pinned: e.target.checked })}>{c.key} 고정</Checkbox>
            <label className="bds-table__width">폭 <input type="number" min={1} aria-label={`${c.key} 열 너비`} value={typeof c.width === "number" ? c.width : ""} placeholder="자동" onChange={e => { const value = e.target.valueAsNumber; if (!e.target.value) changeColumn(c.key, { width: undefined }); else if (Number.isFinite(value) && value > 0) changeColumn(c.key, { width: value }); }} /> px</label>
            <IconButton icon="arrow-up" size="sm" aria-label={`${c.key} 열 앞으로`} disabled={i === 0} onClick={() => moveColumn(c.key, -1)} />
            <IconButton icon="arrow-down" size="sm" aria-label={`${c.key} 열 뒤로`} disabled={i === configured.length - 1} onClick={() => moveColumn(c.key, 1)} />
          </div>)}
          <Button variant="ghost" size="sm" onClick={() => updateColumns([])}>초기화</Button>
        </div>}
      </div>}
      <div className="bds-table__wrap" style={height ? { overflow: "auto", minHeight: 0 } : undefined}>
        {selectable && selCount > 0 && <div className="bds-table__bulk"><b>{selCount}개 선택됨</b>{bulkActions}<button type="button" className="bds-table__clear" onClick={() => onSelectionChange?.([])}>선택 해제</button></div>}
        <div className="bds-table__scroll" tabIndex={0} role="region" aria-label={ariaLabel ?? "표"}>
          <table className={configuredLayout ? "bds-table__configured" : undefined} aria-label={ariaLabel} aria-labelledby={!ariaLabel && header ? hid : undefined}>
            <thead><tr>
              {selectable && <th scope="col" className="bds-table__check"><Checkbox aria-label="전체 선택" checked={all} indeterminate={selCount > 0 && !all} onChange={() => onSelectionChange?.(all ? [] : keys)} /></th>}
              {expandable && <th scope="col" className="bds-table__check" />}
              {columns.map((c) => {
                const sorted = sort?.key === c.key;
                return <th key={c.key} scope="col" data-column={c.key} data-pinned={!!c.pinned} style={{ width: c.width, minWidth: c.width, ...(pinOffsets[c.key] != null ? { "--pin-left": `${pinOffsets[c.key]}px` } : {}) }} className={cx(pinOffsets[c.key] != null && "bds-table__pinned", c.align === "num" && "bds-table__num", sorted && "bds-table__sorted", hideCls(c))}
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
                      {columns.map((c, ci) => { const { value, na } = cellOf(c, row, i); return <td key={c.key} style={{ minWidth: c.width, ...(pinOffsets[c.key] != null ? { "--pin-left": `${pinOffsets[c.key]}px` } : {}) }} className={cx(colCls[ci], pinOffsets[c.key] != null && "bds-table__pinned", na && MISSING_CLASS)}>{value}</td>; })}
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
