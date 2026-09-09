import React, { Fragment, useId, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";
import { Icon } from "../action/Icon.jsx";
import { Checkbox } from "../input/Checkbox.jsx";

const hideCls = (c) => (c.hideBelow === "desktop" ? "d-hide" : c.hideBelow === "tablet" || c.hideOnMobile ? "m-hide" : undefined);

/* 셀 하나의 결측 판정.
   render 없는 열: row[key]가 값이므로 core/missing.js 규칙을 그대로 쓴다. null/undefined는 빈 칸이 아니라 "수집 안 됨"이다.
   render 있는 열: 반환은 ReactNode다. React 규칙대로 null은 "아무것도 그리지 않음"이므로 결측으로 보지 않는다
                   (예: 폐기된 토큰 행의 버튼 없음). 이미 문구로 포맷해 반환하는 사용처만 결측으로 인식한다. */
const cellOf = (c, row, i) => {
  const v = c.render ? c.render(row, i) : row[c.key];
  const na = c.render ? v === MISSING_TEXT : isMissing(v);
  return { value: na ? MISSING_TEXT : v, na };
};

/** 데이터 표. 컨테이너 폭 기준으로 열을 숨기고(hideBelow), 숨긴 정보는 expandable로 펼쳐 본다.
 *  정렬은 표시만 하고 실제 정렬은 소비자가 rows에 반영한다.
 *  결측: render 없는 열의 null·undefined·NaN은 "수집 안 됨"으로 표시한다(빈 칸으로 감추지 않는다). */
export function DataTable({ columns = [], rows = [], rowKey, rowLabel, sort, onSortChange, selectable = false, selectedKeys = [], onSelectionChange, bulkActions, expandable, defaultExpandedKeys = [], header, empty = "표시할 항목이 없습니다.", fit = "flex", width, height, className, style, "aria-label": ariaLabel, ...rest }) {
  const [expanded, setExpanded] = useState(() => new Set(defaultExpandedKeys));
  const autoId = useId(), hid = header?.id ?? autoId;
  const keyOf = rowKey ?? ((r, i) => r.id ?? i);
  const keys = rows.map((r, i) => keyOf(r, i));
  const sel = new Set(selectedKeys);
  const selCount = keys.filter((k) => sel.has(k)).length;
  const all = rows.length > 0 && selCount === rows.length;
  const colCount = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);
  const toggle = (set, k) => { const n = new Set(set); n.has(k) ? n.delete(k) : n.add(k); return [...n]; };
  const requestSort = (key) => onSortChange?.(sort?.key === key ? { key, dir: sort.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  return (
    <div className={cx("bds-table", className)} style={frameStyle({ fit, width, height, style })} {...rest}>
      {header && <div className="bds-table__hd"><h2 id={hid}>{header.title}</h2>{header.meta != null && <span>{header.meta}</span>}</div>}
      <div className="bds-table__wrap" style={height ? { overflow: "auto", minHeight: 0 } : undefined}>
        {selectable && selCount > 0 && <div className="bds-table__bulk"><b>{selCount}개 선택됨</b>{bulkActions}<button type="button" className="bds-table__clear" onClick={() => onSelectionChange?.([])}>선택 해제</button></div>}
        <div className="bds-table__scroll">
          <table aria-label={ariaLabel} aria-labelledby={!ariaLabel && header ? hid : undefined}>
            <thead><tr>
              {selectable && <th scope="col" className="ck"><Checkbox aria-label="전체 선택" checked={all} indeterminate={selCount > 0 && !all} onChange={() => onSelectionChange?.(all ? [] : keys)} /></th>}
              {expandable && <th scope="col" className="ck" />}
              {columns.map((c) => {
                const sorted = sort?.key === c.key;
                return <th key={c.key} scope="col" style={c.width != null ? { width: c.width } : undefined} className={cx(c.align === "num" && "num", sorted && "sorted", hideCls(c))}
                  aria-sort={c.sortable ? (sorted ? (sort.dir === "asc" ? "ascending" : "descending") : "none") : undefined}>
                  {c.sortable ? <button type="button" className="bds-table__sort" onClick={() => requestSort(c.key)}>{c.header}{sorted && <Icon name={sort.dir === "asc" ? "caret-up" : "caret-down"} size={10} />}</button> : c.header}
                </th>;
              })}
            </tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={colCount} className="bds-table__empty">{empty}</td></tr>}
              {rows.map((row, i) => {
                const k = keys[i], isSel = sel.has(k), open = expandable ? expanded.has(k) : false, name = rowLabel ? rowLabel(row) : String(k);
                return (
                  <Fragment key={k}>
                    <tr className={cx(isSel && "bds-table__sel")}>
                      {selectable && <td className="ck"><Checkbox aria-label={`${name} 선택`} checked={isSel} onChange={() => onSelectionChange?.(toggle(selectedKeys, k))} /></td>}
                      {expandable && <td className="ck"><button type="button" className="bds-table__exp" aria-expanded={open} aria-label={`${name} 행 펼치기`} onClick={() => setExpanded((p) => new Set(toggle(p, k)))}><Icon name="caret-right" size={12} /></button></td>}
                      {columns.map((c) => { const { value, na } = cellOf(c, row, i); return <td key={c.key} className={cx(c.align === "num" && "num", na && MISSING_CLASS, hideCls(c))}>{value}</td>; })}
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
