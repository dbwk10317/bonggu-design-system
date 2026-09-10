import * as React from "react";
import { Divider, Stack, Inline, Panel, Button } from "@dbwk10317/bonggu-design-system";

export const Basic = () => (
  <Panel>
    <Stack gap={4}>
      <b>게이트웨이</b>
      <Divider />
      <p>노드가 값을 올리는 곳입니다.</p>
    </Stack>
  </Panel>
);

/* 라벨은 두 선택지 사이를 가를 때. 목록 구분에는 라벨 없는 선을 쓴다. */
export const WithLabel = () => (
  <Stack gap={4} style={{ maxWidth: 320 }}>
    <Button variant="primary">SSO 로 로그인</Button>
    <Divider label="또는" />
    <Button variant="secondary">토큰으로 로그인</Button>
  </Stack>
);

/* 가로로 나열한 메타 값 사이에는 세로선. */
export const Vertical = () => (
  <Inline gap={3} align="center">
    <span className="bds-mono">2.14.0</span>
    <Divider vertical />
    <span>서울</span>
    <Divider vertical />
    <span className="bds-mono">38 / 38</span>
  </Inline>
);
