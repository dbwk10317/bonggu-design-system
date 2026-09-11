import * as React from "react";
import { Tooltip, IconButton, Button, Inline, Stack, Kbd, Tag } from "@dbwk10317/bonggu-design-system";

/* 아이콘만 있는 버튼은 이름이 안 보인다. aria-label 로 읽어 주고 툴팁으로 보여 준다. */
export const IconLabels = () => (
  <Inline gap={2}>
    <Tooltip content="다시 읽기"><IconButton icon="arrows-clockwise" variant="ghost" aria-label="다시 읽기" /></Tooltip>
    <Tooltip content={<>명령 팔레트 <Kbd>Ctrl</Kbd> <Kbd>K</Kbd></>}><IconButton icon="magnifying-glass" variant="ghost" aria-label="명령 팔레트 열기" /></Tooltip>
    <Tooltip content="다크 테마로"><IconButton icon="moon" variant="ghost" aria-label="다크 테마로" /></Tooltip>
    <Tooltip content="이 노드를 격리합니다"><IconButton icon="plugs" variant="ghost" aria-label="격리" /></Tooltip>
  </Inline>
);

export const Sides = () => (
  <Inline gap={4} justify="center" style={{ padding: 32 }}>
    {(["top", "right", "bottom", "left"] as const).map((s) => (
      <Tooltip key={s} content={`side="${s}"`} side={s}><Button variant="secondary" size="sm">{s}</Button></Tooltip>
    ))}
  </Inline>
);

/* 잘린 텍스트의 전문을 보여 줄 때도 쓴다. */
export const FullText = () => (
  <Stack gap={3} style={{ maxWidth: 220 }}>
    <Tooltip content="봉구 성수점 · 서울특별시 성동구 아차산로 17길">
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
        봉구 성수점 · 서울특별시 성동구 아차산로 17길
      </span>
    </Tooltip>
    <Tooltip content="마지막 수집 2026-09-11 14:02:37"><Tag>22분 전</Tag></Tooltip>
  </Stack>
);

/* 클릭할 것이 들어가면 툴팁이 아니다. Popover 나 DropdownMenu 를 쓴다. */
export const Delay = () => (
  <Inline gap={3}>
    <Tooltip content="바로 뜸" delay={0}><Button variant="secondary" size="sm">delay 0</Button></Tooltip>
    <Tooltip content="기본 300ms"><Button variant="secondary" size="sm">기본</Button></Tooltip>
    <Tooltip content="느리게" delay={800}><Button variant="secondary" size="sm">delay 800</Button></Tooltip>
  </Inline>
);
