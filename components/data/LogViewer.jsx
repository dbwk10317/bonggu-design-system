import React, { useEffect, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { SearchField } from "../input/SearchField.jsx";
import { Select } from "../input/Select.jsx";
import { Button } from "../action/Button.jsx";
import { IconButton } from "../action/IconButton.jsx";

/** @param {Parameters<typeof import("./LogViewer.d.ts").LogViewer>[0]} props */
export function LogViewer({ lines = [], follow = true, searchable = false, wrap = true, numbers = true, fit = "flex", width, height = 240, className, style, "aria-label": ariaLabel = "로그", ...rest }) {
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [previous, setPrevious] = useState(lines);
  const [query, setQuery] = useState(""), [level, setLevel] = useState("all"), [paused, setPaused] = useState(false), [unread, setUnread] = useState(0), [match, setMatch] = useState(0);
  const following = follow && !paused && !query;
  const records = lines.map((line, index) => ({ ...(typeof line === "string" ? { text: line } : line), index }));
  const visible = records.filter(line => level === "all" || line.level === level);
  const matches = query ? visible.filter(line => line.text.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : [];
  const selected = matches[Math.min(match, Math.max(0, matches.length - 1))];
  if (previous !== lines) {
    const last = previous.at(-1);
    const lastIndex = last == null ? -1 : lines.findIndex(line => typeof line === "object" && typeof last === "object" && last.id != null ? line.id === last.id : line === last);
    setPrevious(lines); setUnread(count => following ? 0 : count + Math.max(0, lines.length - lastIndex - 1));
  }
  useEffect(() => { if (following && ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines, following]);
  useEffect(() => {
    const parent = ref.current, index = selected?.index; if (!parent || index == null) return;
    const target = parent.querySelector(`[data-log-index="${index}"]`); if (!target) return;
    const a = target.getBoundingClientRect(), b = parent.getBoundingClientRect();
    if (a.top < b.top) parent.scrollTop += a.top - b.top; else if (a.bottom > b.bottom) parent.scrollTop += a.bottom - b.bottom;
  }, [selected?.index, query]);
  const highlight = (/** @type {string} */ text) => {
    if (!query) return text;
    /** @type {import("react").ReactNode[]} */ const parts = [];
    const lower = text.toLocaleLowerCase(), needle = query.toLocaleLowerCase(); let start = 0, found = lower.indexOf(needle);
    while (found >= 0) { parts.push(text.slice(start, found), <mark key={found}>{text.slice(found, found + query.length)}</mark>); start = found + query.length; found = lower.indexOf(needle, start); }
    parts.push(text.slice(start)); return parts;
  };
  return <div className={cx("bds-logviewer", className)} style={frameStyle({ fit, width, height, style })} {...rest}>
    {searchable && <div className="bds-explore-tools" role="region" aria-label="로그 도구" tabIndex={0}>
      <SearchField aria-label="로그 검색" shortcut={false} value={query} onChange={value => { setQuery(value); setMatch(0); if (value) setPaused(true); }} />
      <Select aria-label="로그 레벨" value={level} options={[{ value: "all", label: "모든 레벨" }, ...["info", "warn", "error", "debug", "ok"].map(value => ({ value, label: value.toUpperCase() }))]} onChange={e => { setLevel(e.target.value); setMatch(0); setPaused(true); }} />
      <IconButton icon="caret-up" aria-label="이전 검색 결과" disabled={!matches.length} onClick={() => setMatch((Math.min(match, matches.length - 1) - 1 + matches.length) % matches.length)} />
      <span className="bds-logviewer__count" role="status">{matches.length ? `${Math.min(match + 1, matches.length)} / ${matches.length}행` : query ? "검색 결과 없음" : "검색 대기"}</span>
      <IconButton icon="caret-down" aria-label="다음 검색 결과" disabled={!matches.length} onClick={() => setMatch((match + 1) % matches.length)} />
      <Button variant="ghost" disabled={!follow} onClick={() => { setPaused(following); if (!following) { setQuery(""); setUnread(0); } }}>{following ? "일시 정지" : `따라가기${unread ? ` · ${unread}건` : ""}`}</Button>
    </div>}
    <div ref={ref} tabIndex={0} role="log" aria-label={ariaLabel} aria-live={following ? "polite" : "off"} className={cx("bds-log", !wrap && "bds-log--nowrap")} onScroll={e => { if (!searchable) return; const el = e.currentTarget; if (el.scrollHeight - el.clientHeight - el.scrollTop > 1) setPaused(true); }}>
      {visible.map(o => <div key={o.id ?? o.index} data-log-index={o.index} className={cx("bds-log__line", selected?.index === o.index && "bds-log__line--match")}>
        <span className="bds-log__ln" aria-hidden="true">{numbers ? o.index + 1 : ""}</span>
        <span className={cx("bds-log__lv", o.level && `bds-log__lv--${o.level}`)}>{o.time ?? (o.level ? o.level.toUpperCase() : "")}</span>
        <span className="bds-log__msg">{o.level && o.time ? <span className={`bds-log__lv bds-log__lv--${o.level}`}>{o.level.toUpperCase()} </span> : null}{highlight(o.text)}</span>
      </div>)}
      {!visible.length && <p className="bds-logviewer__empty">표시할 로그가 없습니다.</p>}
    </div>
  </div>;
}
