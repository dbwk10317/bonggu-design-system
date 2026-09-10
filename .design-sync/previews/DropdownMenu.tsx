import * as React from "react";
import { DropdownMenu, Button, Inline, Stack } from "@dbwk10317/bonggu-design-system";

const noop = () => {};

/* 행 액션이 3개 이상이면 "…" 로 접는다. 위험 동작은 구분선 뒤 맨 아래. */
export const Basic = () => (
  <DropdownMenu
    aria-label="노드 행 동작"
    items={[
      { label: "상세 열기", icon: "arrow-right", onSelect: noop },
      { label: "에이전트 재시작", icon: "arrow-clockwise", onSelect: noop },
      { label: "설정 다시 읽기", icon: "arrows-clockwise", onSelect: noop },
      "-",
      { label: "격리", icon: "plugs", danger: true, onSelect: noop },
    ]}
  />
);

export const CustomTrigger = () => (
  <Inline gap={3}>
    <DropdownMenu
      trigger={<Button variant="secondary" icon="caret-down">일괄 작업</Button>}
      items={[
        { label: "선택한 노드 재시작", icon: "arrow-clockwise", shortcut: "R", onSelect: noop },
        { label: "설정 내려받기", icon: "download", shortcut: "D", onSelect: noop },
        "-",
        { label: "선택 해제", onSelect: noop },
      ]}
    />
    <DropdownMenu
      trigger={<Button variant="ghost" icon="export">내보내기</Button>}
      align="end"
      items={[
        { label: "CSV", icon: "file-csv", onSelect: noop },
        { label: "JSON", icon: "brackets-curly", onSelect: noop },
        { label: "PDF 보고서", icon: "file-pdf", disabled: true },
      ]}
    />
  </Inline>
);

export const Alignment = () => (
  <Stack gap={4}>
    <Inline><DropdownMenu align="start" aria-label="왼쪽 정렬" items={[{ label: "왼쪽에서 펼침", onSelect: noop }, { label: "두 번째", onSelect: noop }]} /></Inline>
    <Inline justify="end"><DropdownMenu align="end" aria-label="오른쪽 정렬" items={[{ label: "오른쪽에서 펼침", onSelect: noop }, { label: "두 번째", onSelect: noop }]} /></Inline>
  </Stack>
);
