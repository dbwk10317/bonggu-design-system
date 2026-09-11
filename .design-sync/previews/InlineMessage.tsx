import * as React from "react";
import { InlineMessage, Stack, Panel, CardHead, Field, TextField, Code } from "@dbwk10317/bonggu-design-system";

/* 어떤 것 하나에 붙는 짧은 설명이다. 화면 전체에 걸치는 알림은 AlertBanner. */
export const Tones = () => (
  <Stack gap={3}>
    <InlineMessage tone="neutral">이 값은 다음 수집 주기에 반영됩니다.</InlineMessage>
    <InlineMessage tone="info">에이전트 2.14.0 이상에서만 동작합니다.</InlineMessage>
    <InlineMessage tone="ok">두 장치에 같은 값이 적용되어 있습니다.</InlineMessage>
    <InlineMessage tone="warn">무인 모드는 결제 리더기에서 지원하지 않습니다.</InlineMessage>
    <InlineMessage tone="crit">이 노드는 22분째 응답하지 않습니다.</InlineMessage>
  </Stack>
);

export const InPanel = () => (
  <Panel>
    <CardHead title="롤아웃 매니페스트" meta="2.15.0-rc1" metaMono />
    <Stack gap={3}>
      <InlineMessage tone="warn">
        <Code>2.13.2</Code> 를 쓰는 노드 2대는 이 매니페스트를 무시합니다.
      </InlineMessage>
      <p>배치 6개로 나눠 8대씩 내보냅니다.</p>
    </Stack>
  </Panel>
);

export const NextToField = () => (
  <Stack gap={3} style={{ maxWidth: 420 }}>
    <Field label="수집 주기"><TextField defaultValue="1" suffix="초" mono /></Field>
    <InlineMessage tone="warn">1초 주기는 엣지 노드의 배터리를 눈에 띄게 깎습니다.</InlineMessage>
  </Stack>
);

export const CustomIcon = () => (
  <Stack gap={3}>
    <InlineMessage tone="info" icon="clock-counter-clockwise">마지막 값은 22분 전 것입니다.</InlineMessage>
    <InlineMessage tone="neutral" icon="lock-simple">관리자만 바꿀 수 있습니다.</InlineMessage>
  </Stack>
);
