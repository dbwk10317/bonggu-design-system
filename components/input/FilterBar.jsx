import React, { forwardRef, useId, useRef, useState } from "react";
import { cx, frameStyle, assignRef } from "../core/frame.js";
import { SearchField } from "./SearchField.jsx";
import { Select } from "./Select.jsx";
import { TextField } from "./TextField.jsx";
import { Button } from "../action/Button.jsx";
import { IconButton } from "../action/IconButton.jsx";

const OPERATORS = [{ value: "equals", label: "같음" }, { value: "notEquals", label: "다름" }, { value: "contains", label: "포함" }];
/** @param {import("./FilterBar.d.ts").FilterBarProps} props
 * @param {import("react").ForwardedRef<HTMLInputElement>} forwardedRef */
function FilterBarImpl({ fields = [], filters = [], onFiltersChange, query = "", onQueryChange, fit = "flex", width, className, style, ...rest }, forwardedRef) {
  const uid = useId(), serial = useRef(0), search = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [fieldKey, setField] = useState("");
  const [operator, setOperator] = useState(/** @type {import("./FilterBar.d.ts").FilterOperator} */ ("equals"));
  const [draft, setDraft] = useState("");
  const field = fields.find(f => f.key === fieldKey) ?? fields[0];
  const value = field?.options ? (field.options.some(o => o.value === draft) ? draft : field.options[0]?.value ?? "") : draft;
  const add = () => {
    if (!field || !value.trim()) return;
    let id = "";
    do { id = `${uid}-${serial.current++}`; } while (filters.some(token => token.id === id));
    onFiltersChange?.([...filters, { id, field: field.key, operator, value }]); setDraft("");
  };
  return <div className={cx("bds-filter", className)} style={frameStyle({ fit, width, style })} {...rest}>
    <div className="bds-explore-tools">
      <SearchField ref={el => { search.current = el; assignRef(forwardedRef, el); }} aria-label="검색" shortcut={false} value={query} onChange={onQueryChange ?? (() => {})} />
      {field && <>
        <Select aria-label="필터 항목" value={field.key} options={fields.map(f => ({ value: f.key, label: f.label }))} onChange={e => { setField(e.target.value); setDraft(""); }} />
        <Select aria-label="필터 연산" options={OPERATORS} value={operator} onChange={e => setOperator(/** @type {import("./FilterBar.d.ts").FilterOperator} */ (e.target.value))} />
        {field.options ? <Select aria-label="필터 값" options={field.options} value={value} onChange={e => setDraft(e.target.value)} /> : <TextField aria-label="필터 값" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />}
        <Button variant="secondary" icon="plus" onClick={add} disabled={!value.trim()}>추가</Button>
      </>}
      {(filters.length > 0 || query) && <Button variant="ghost" onClick={() => { onFiltersChange?.([]); onQueryChange?.(""); search.current?.focus(); }}>초기화</Button>}
    </div>
    {filters.length > 0 && <ul className="bds-filter__tokens" aria-label="적용된 필터">{filters.map(token => {
      const f = fields.find(item => item.key === token.field), v = f?.options?.find(o => o.value === token.value)?.label ?? token.value;
      const label = `${f?.label ?? token.field} ${OPERATORS.find(o => o.value === token.operator)?.label ?? token.operator} ${v}`;
      return <li key={token.id}><span>{label}</span><IconButton icon="x" variant="ghost" size="sm" aria-label={`${label} 해제`} onClick={() => { onFiltersChange?.(filters.filter(t => t.id !== token.id)); search.current?.focus(); }} /></li>;
    })}</ul>}
  </div>;
}
export const FilterBar = forwardRef(FilterBarImpl);
