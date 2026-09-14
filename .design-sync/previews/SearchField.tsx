import * as React from "react";
import { SearchField, Toolbar, ToolbarGrow, Panel, Stack, Select } from "@dbwk10317/bonggu-design-system";

const NODES = ["edge-seoul-01 · 봉구 강남점", "edge-seoul-03 · 봉구 성수점", "edge-busan-02 · 봉구 해운대점", "edge-jeju-01 · 봉구 제주점"];

/* Controlled; always provide value and onChange. */
export const Filtering = () => {
  const [q, setQ] = React.useState("");
  const shown = NODES.filter((n) => n.includes(q));
  return (
    <Stack gap={3}>
      <SearchField value={q} onChange={setQ} placeholder="노드 이름 또는 매장" aria-label="노드 검색" />
      <Panel padding="sm">
        <Stack gap={2}>
          {shown.length ? shown.map((n) => <span key={n} className="bds-mono">{n}</span>) : <span>맞는 노드가 없습니다.</span>}
        </Stack>
      </Panel>
    </Stack>
  );
};

/* Use onSearch to query only on Enter instead of filtering on every keystroke. */
export const OnEnter = () => {
  const [q, setQ] = React.useState("");
  const [ran, setRan] = React.useState("");
  return (
    <Stack gap={3}>
      <SearchField value={q} onChange={setQ} onSearch={setRan} placeholder="Enter 로 조회" aria-label="로그 검색" />
      <span className="bds-mono">{ran ? `조회: ${ran}` : "아직 조회하지 않음"}</span>
    </Stack>
  );
};

export const InToolbar = () => {
  const [q, setQ] = React.useState("");
  return (
    <Panel padding="sm">
      <Toolbar>
        <ToolbarGrow><SearchField value={q} onChange={setQ} placeholder="감사 로그 검색" aria-label="감사 로그 검색" /></ToolbarGrow>
        <Select options={[{ value: "", label: "모든 동작" }, { value: "login", label: "로그인" }]} aria-label="동작" />
      </Toolbar>
    </Panel>
  );
};

/* Enable the shortcut only when a screen has one search field; multiple would steal focus from each other. */
export const NoShortcut = () => {
  const [q, setQ] = React.useState("");
  return <SearchField value={q} onChange={setQ} shortcut={false} size="sm" fit="fixed" width={200} placeholder="단축키 없음" aria-label="보조 검색" />;
};
