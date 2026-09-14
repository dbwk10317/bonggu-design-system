import * as React from "react";
import { Toolbar, ToolbarGrow, SearchField, Select, Button, IconButton, Panel, Stack, Tag } from "@dbwk10317/bonggu-design-system";

const REGIONS = [{ value: "", label: "모든 지역" }, { value: "seoul", label: "서울" }, { value: "busan", label: "부산" }];

/* A filter row above a table/list; the search grows, and actions attach at the right via end. */
export const Basic = () => (
  <Panel padding="sm">
    <Toolbar end={<Button size="sm" variant="primary" icon="plus">노드 추가</Button>}>
      <ToolbarGrow><SearchField placeholder="노드 이름 또는 매장" aria-label="노드 검색" /></ToolbarGrow>
      <Select options={REGIONS} aria-label="지역" />
    </Toolbar>
  </Panel>
);

export const WithoutEnd = () => (
  <Panel padding="sm">
    <Toolbar>
      <ToolbarGrow><SearchField placeholder="감사 로그 검색" aria-label="감사 로그 검색" /></ToolbarGrow>
      <IconButton icon="funnel" variant="ghost" aria-label="필터" />
      <IconButton icon="arrows-clockwise" variant="ghost" aria-label="다시 읽기" />
    </Toolbar>
  </Panel>
);

/* Also used as a bar announcing a selection state. */
export const SelectionBar = () => (
  <Stack gap={3}>
    <Panel padding="sm">
      <Toolbar end={<><Button size="sm" variant="secondary">해제</Button><Button size="sm" variant="danger">격리</Button></>}>
        <ToolbarGrow><Tag accent>3대 선택됨</Tag></ToolbarGrow>
      </Toolbar>
    </Panel>
  </Stack>
);
