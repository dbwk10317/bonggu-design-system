import * as React from "react";
import { CardHead, Panel, Stack, Button, StatusPill, Sparkline } from "@dbwk10317/bonggu-design-system";

/* First line of a Panel: title says what the card shows, meta gives its scope or time. */
export const InPanel = () => (
  <Panel>
    <CardHead title="지역별 요청 비중" meta="최근 24시간" />
    <div style={{ height: 56 }}><Sparkline values={[31, 34, 30, 42, 58, 51, 47, 63, 71, 66]} /></div>
  </Panel>
);

/* Use metaMono for fixed-width values like versions or IDs. */
export const MonoMeta = () => (
  <Panel>
    <CardHead title="진행 중인 롤아웃" meta="2.15.0-rc1" metaMono />
    <p>24 / 38 노드에 적용했습니다.</p>
  </Panel>
);

export const WithAction = () => (
  <Stack gap={4}>
    <Panel>
      <CardHead title="자동화 토큰" meta={<Button size="sm" variant="secondary" icon="plus">토큰 발급</Button>} />
      <p>이 조직에서 쓰는 토큰 4개.</p>
    </Panel>
    <Panel>
      <CardHead title="게이트웨이" meta={<StatusPill tone="warn" pulse>수집 지연</StatusPill>} />
      <p>노드 2대가 5초 주기를 놓치고 있습니다.</p>
    </Panel>
  </Stack>
);

export const TitleOnly = () => (
  <Panel>
    <CardHead title="최근 감사 로그" />
    <p>지난 7일 동안 남은 기록.</p>
  </Panel>
);
