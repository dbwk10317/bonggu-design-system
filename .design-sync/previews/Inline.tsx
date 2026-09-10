import * as React from "react";
import { Inline, Stack, Button, Tag, StatusPill, Panel } from "@dbwk10317/bonggu-design-system";

export const Basic = () => (
  <Inline gap={2} align="center">
    <StatusPill tone="ok">정상</StatusPill>
    <Tag>서울</Tag><Tag>BG-EDGE-2</Tag><Tag>2.14.0</Tag>
  </Inline>
);

export const Align = () => (
  <Stack gap={4}>
    {(["start", "center", "end", "baseline"] as const).map((a) => (
      <Inline key={a} gap={3} align={a} style={{ background: "var(--fill-1)", padding: 8, borderRadius: "var(--r-sm)" }}>
        <span className="bds-mono" style={{ width: 72 }}>{a}</span>
        <span style={{ fontSize: 24 }}>큰 글자</span>
        <span style={{ fontSize: 12 }}>작은 글자</span>
        <Button size="sm">버튼</Button>
      </Inline>
    ))}
  </Stack>
);

export const Justify = () => (
  <Stack gap={3}>
    {(["start", "center", "end", "space-between"] as const).map((j) => (
      <Inline key={j} gap={2} justify={j} style={{ background: "var(--fill-1)", padding: 8, borderRadius: "var(--r-sm)" }}>
        <Tag>{j}</Tag><Tag>둘째</Tag><Tag>셋째</Tag>
      </Inline>
    ))}
  </Stack>
);

/* 기본은 좁아지면 줄바꿈이다. 한 줄을 지켜야 하는 툴바 조각만 wrap={false}. */
export const Wrap = () => (
  <Stack gap={4}>
    <Panel padding="sm" style={{ width: 260 }}>
      <Inline gap={2}>{"서울 경기 부산 대구 광주 대전 울산".split(" ").map((r) => <Tag key={r}>{r}</Tag>)}</Inline>
    </Panel>
    <Panel padding="sm" style={{ width: 260, overflowX: "auto" }}>
      <Inline gap={2} wrap={false}>{"서울 경기 부산 대구 광주 대전 울산".split(" ").map((r) => <Tag key={r}>{r}</Tag>)}</Inline>
    </Panel>
  </Stack>
);
