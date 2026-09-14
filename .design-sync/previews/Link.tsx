import * as React from "react";
import { Link, Stack, Panel, InlineMessage } from "@dbwk10317/bonggu-design-system";

/* For sending somewhere else from within a sentence; use Link, not Button, for navigation. */
export const InProse = () => (
  <Stack gap={3}>
    <p>이 노드는 <Link href="#nodes">노드 목록</Link>에서도 볼 수 있습니다.</p>
    <p>지표는 <Link href="https://grafana.example" external>Grafana</Link> 에 더 자세히 남습니다.</p>
  </Stack>
);

/* external marks it as leaving in a new tab; don't use it for navigation within the same console. */
export const External = () => (
  <Stack gap={2}>
    <Link href="https://grafana.example" external>Grafana 대시보드</Link>
    <Link href="https://status.bonggu.me" external>공개 상태 페이지</Link>
  </Stack>
);

/* Use quiet for body-text color when blue text piles up in a dense list or table. */
export const Quiet = () => (
  <Panel padding="sm">
    <Stack gap={2}>
      <Link href="#n1" quiet>edge-seoul-01 · 봉구 강남점</Link>
      <Link href="#n2" quiet>edge-seoul-02 · 봉구 합정점</Link>
      <Link href="#n3" quiet>edge-seoul-03 · 봉구 성수점</Link>
    </Stack>
  </Panel>
);

export const InMessage = () => (
  <InlineMessage tone="warn">
    노드 2대가 수집 주기를 놓치고 있습니다. <Link href="#nodes">노드 목록에서 확인</Link>
  </InlineMessage>
);
