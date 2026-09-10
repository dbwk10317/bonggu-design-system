import * as React from "react";
import { SearchField, Toolbar, ToolbarGrow, Panel, Stack, Select } from "@dbwk10317/bonggu-design-system";

const NODES = ["edge-seoul-01 · 봉구 강남점", "edge-seoul-03 · 봉구 성수점", "edge-busan-02 · 봉구 해운대점", "edge-jeju-01 · 봉구 제주점"];

/* 제어형이다. value 와 onChange 를 반드시 준다. */
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

/* 입력마다 거르지 않고 Enter 에서만 조회할 때는 onSearch. */
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

/* 화면에 검색이 하나뿐일 때만 단축키를 켠다. 여럿이면 서로 포커스를 뺏는다. */
export const NoShortcut = () => {
  const [q, setQ] = React.useState("");
  return <SearchField value={q} onChange={setQ} shortcut={false} size="sm" fit="fixed" width={200} placeholder="단축키 없음" aria-label="보조 검색" />;
};
