import * as React from "react";
import { CodeBlock, Stack, Panel, CardHead } from "@dbwk10317/bonggu-design-system";

const INSTALL = `curl -fsSL https://edge.bonggu.me/install.sh | sh
bonggu-agent enroll --token bge_8f21c0a4d9 --site "봉구 강남점"
systemctl enable --now bonggu-agent`;

const MANIFEST = `{
  "release": "2.15.0-rc1",
  "batches": 6,
  "pause_on_error": true,
  "targets": { "region": ["서울", "경기"], "model": "BG-EDGE-2" }
}`;

/* 줄바꿈하지 않고 가로로 스크롤한다. 명령이 접혀서 잘못 복사되는 일을 막는다. */
export const Shell = () => <CodeBlock>{INSTALL}</CodeBlock>;

export const Json = () => <CodeBlock language="json">{MANIFEST}</CodeBlock>;

export const InPanel = () => (
  <Panel>
    <CardHead title="노드 등록" meta="매장 단말에서 한 번" />
    <Stack gap={3}>
      <p>아래를 그대로 붙여 넣습니다. 토큰은 24시간 뒤 만료됩니다.</p>
      <CodeBlock>{INSTALL}</CodeBlock>
    </Stack>
  </Panel>
);

export const LongLine = () => (
  <CodeBlock language="bash">{`bonggu-agent rollout --release 2.15.0-rc1 --batch-size 8 --pause-on-error --targets region=서울,경기 --dry-run --verbose`}</CodeBlock>
);
