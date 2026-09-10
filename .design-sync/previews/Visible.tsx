import * as React from "react";
import { Visible, Inline, Stack, Button, Tag, Panel } from "@dbwk10317/bonggu-design-system";

/* 좁은 화면에서 자리를 못 내는 보조 동작을 숨긴다. 핵심 동작은 절대 숨기지 않는다. */
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

/* 같은 정보를 폭에 따라 다른 모양으로 낼 때 짝으로 쓴다. */
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
