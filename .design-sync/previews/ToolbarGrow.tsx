import * as React from "react";
import { Toolbar, ToolbarGrow, SearchField, Select, Button, Panel, Stack } from "@dbwk10317/bonggu-design-system";

const STATES = [{ value: "", label: "모든 상태" }, { value: "online", label: "온라인" }, { value: "degraded", label: "수집 지연" }];

/* Wraps the one thing in a Toolbar that should take the remaining width, usually a search input. */
export const Basic = () => (
  <Panel padding="sm">
    <Toolbar end={<Button size="sm" variant="primary">적용</Button>}>
      <ToolbarGrow><SearchField placeholder="노드 검색" aria-label="노드 검색" /></ToolbarGrow>
      <Select options={STATES} aria-label="상태" />
    </Toolbar>
  </Panel>
);

/* Without it everything is content-width and bunches to the left; shown side by side to see the difference. */
export const WithAndWithout = () => (
  <Stack gap={3}>
    <Panel padding="sm">
      <Toolbar>
        <ToolbarGrow><SearchField placeholder="ToolbarGrow 있음 — 검색이 폭을 채움" aria-label="있음" /></ToolbarGrow>
        <Select options={STATES} aria-label="상태 1" />
      </Toolbar>
    </Panel>
    <Panel padding="sm">
      <Toolbar>
        <SearchField placeholder="없음 — 내용 폭" aria-label="없음" />
        <Select options={STATES} aria-label="상태 2" />
      </Toolbar>
    </Panel>
  </Stack>
);
