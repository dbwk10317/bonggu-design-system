import React, { useEffect, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** @param {import("./TreeView.d.ts").TreeViewProps} props */
export function TreeView({ nodes = [], selectedId, onSelect, expandedIds, defaultExpandedIds = [], onExpandedChange, className, "aria-label": ariaLabel = "계층 탐색", ...rest }) {
  const [local, setLocal] = useState(defaultExpandedIds), [active, setActive] = useState(/** @type {string | null} */ (null));
  const root = useRef(/** @type {HTMLDivElement | null} */ (null));
  const hadFocus = useRef(false);
  const open = new Set(expandedIds ?? local);
  /** @type {{node: import("./TreeView.d.ts").TreeNode, level: number, parent: string | null, pos: number, size: number}[]} */
  const rows = [];
  const visit = (/** @type {import("./TreeView.d.ts").TreeNode[]} */ list, /** @type {number} */ level, /** @type {string | null} */ parent) => list.forEach((node, i) => { rows.push({ node, level, parent, pos: i + 1, size: list.length }); if (open.has(node.id) && node.children) visit(node.children, level + 1, node.id); });
  visit(nodes, 1, null);
  const focusId = rows.some(r => r.node.id === active) ? active : rows.some(r => r.node.id === selectedId) ? selectedId : rows[0]?.node.id;
  useEffect(() => { if (hadFocus.current && root.current && !root.current.contains(document.activeElement)) /** @type {HTMLElement | null} */ (root.current.querySelector('[tabindex="0"]'))?.focus(); }, [focusId]);
  const focus = (/** @type {string} */ id) => { setActive(id); const target = [...(root.current?.querySelectorAll('[role="treeitem"]') ?? [])].find(el => el.getAttribute("data-node") === id); /** @type {HTMLElement | undefined} */ (target)?.focus(); };
  const expand = (/** @type {string} */ id) => { const next = new Set(open); next.has(id) ? next.delete(id) : next.add(id); setLocal([...next]); onExpandedChange?.([...next]); };
  return <div ref={root} role="tree" aria-label={ariaLabel} className={cx("bds-tree", className)} onFocus={() => { hadFocus.current = true; }} onBlur={e => { if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) hadFocus.current = false; }} {...rest}>
    {rows.map(({ node, level, pos, size, parent }, index) => <div key={node.id} role="treeitem" data-node={node.id} aria-level={level} aria-posinset={pos} aria-setsize={size} aria-expanded={node.children?.length ? open.has(node.id) : undefined} aria-selected={selectedId === node.id} aria-disabled={node.disabled || undefined} tabIndex={focusId === node.id ? 0 : -1} className="bds-tree__item" style={{ "--tree-level": level - 1 }} onFocus={() => setActive(node.id)} onClick={() => { focus(node.id); if (!node.disabled) onSelect?.(node.id); }} onKeyDown={e => {
      let next;
      if (e.key === "ArrowDown") next = rows[index + 1]?.node.id;
      else if (e.key === "ArrowUp") next = rows[index - 1]?.node.id;
      else if (e.key === "Home") next = rows[0]?.node.id;
      else if (e.key === "End") next = rows.at(-1)?.node.id;
      else if (e.key === "ArrowRight") { if (node.children?.length) { if (!open.has(node.id)) expand(node.id); else next = node.children[0].id; } }
      else if (e.key === "ArrowLeft") { if (node.children?.length && open.has(node.id)) expand(node.id); else next = parent; }
      else if (e.key === "Enter" || e.key === " ") { if (!node.disabled) onSelect?.(node.id); }
      else return;
      e.preventDefault(); if (next) focus(next);
    }}>
      {node.children?.length ? <button type="button" className="bds-tree__toggle" tabIndex={-1} aria-label={`${node.label} ${open.has(node.id) ? "접기" : "펼치기"}`} onClick={e => { e.stopPropagation(); focus(node.id); expand(node.id); }}><Icon name={open.has(node.id) ? "caret-down" : "caret-right"} size={14} /></button> : <Icon name="file" size={14} />}
      <span>{node.label}</span>
    </div>)}
    {!rows.length && <p className="bds-tree__empty">표시할 항목이 없습니다.</p>}
  </div>;
}
