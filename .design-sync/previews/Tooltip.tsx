import * as React from "react";
import { Tooltip, IconButton, Button, Inline, Stack, Kbd, Tag } from "@dbwk10317/bonggu-design-system";

/* An icon-only button has no visible name; read it with aria-label and show it in a tooltip. */
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

/* Also used to show the full text of something truncated. */
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

/* If it contains something clickable, it's not a tooltip — use Popover or DropdownMenu. */
export const Delay = () => (
  <Inline gap={3}>
    <Tooltip content="바로 뜸" delay={0}><Button variant="secondary" size="sm">delay 0</Button></Tooltip>
    <Tooltip content="기본 300ms"><Button variant="secondary" size="sm">기본</Button></Tooltip>
    <Tooltip content="느리게" delay={800}><Button variant="secondary" size="sm">delay 800</Button></Tooltip>
  </Inline>
);
