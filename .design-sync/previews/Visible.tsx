import * as React from "react";
import { Visible, Inline, Stack, Button, Tag, Panel } from "@dbwk10317/bonggu-design-system";

/* Hides secondary actions that don't fit on a narrow screen; never hide the primary action. */
export const HideSecondary = () => (
  <Panel padding="sm">
    <Inline gap={2} align="center" wrap={false}>
      <b>노드</b>
      <Visible above="lg"><Tag>서울 12</Tag><Tag>경기 8</Tag></Visible>
      <Visible above="md"><Button size="sm" variant="secondary" icon="download">보고서</Button></Visible>
      <Button size="sm" variant="primary">추가</Button>
    </Inline>
  </Panel>
);

/* Used in pairs to render the same info differently depending on width. */
export const SwapByWidth = () => (
  <Stack gap={3}>
    <Visible above="md"><Panel padding="sm">넓은 화면: 표로 봅니다 (md 이상)</Panel></Visible>
    <Visible below="md"><Panel padding="sm">좁은 화면: 카드로 봅니다 (md 미만)</Panel></Visible>
  </Stack>
);

export const Breakpoints = () => (
  <Stack gap={2}>
    <Visible above="sm"><span className="bds-mono">above=&quot;sm&quot; · 640px 이상</span></Visible>
    <Visible above="md"><span className="bds-mono">above=&quot;md&quot; · 768px 이상</span></Visible>
    <Visible above="lg"><span className="bds-mono">above=&quot;lg&quot; · 1024px 이상</span></Visible>
    <Visible below="lg"><span className="bds-mono">below=&quot;lg&quot; · 1024px 미만</span></Visible>
  </Stack>
);
