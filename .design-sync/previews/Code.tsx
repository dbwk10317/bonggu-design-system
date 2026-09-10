import * as React from "react";
import { Code, Stack, Panel, InlineMessage } from "@dbwk10317/bonggu-design-system";

/* 문장 안의 식별자·경로·값. 여러 줄 명령은 CodeBlock 이다. */
export const InProse = () => (
  <Stack gap={3}>
    <p><Code>edge-seoul-03</Code> 이 22분 동안 응답하지 않았습니다.</p>
    <p>설정은 <Code>/etc/bonggu/agent.toml</Code> 에 있습니다.</p>
    <p>폐기하면 <Code>bge_8f21c0a4d9</Code> 를 쓰는 자동화가 즉시 <Code>401</Code> 을 받습니다.</p>
  </Stack>
);

export const InMessage = () => (
  <Panel padding="sm">
    <InlineMessage tone="warn">
      <Code>2.13.2</Code> 를 쓰는 노드 2대는 이 설정을 무시합니다. <Code>2.14.0</Code> 이상이 필요합니다.
    </InlineMessage>
  </Panel>
);

export const Values = () => (
  <Stack gap={2}>
    <span>상태 <Code>degraded</Code></span>
    <span>지연 <Code>210 ms</Code></span>
    <span>모델 <Code>BG-EDGE-2</Code></span>
  </Stack>
);
