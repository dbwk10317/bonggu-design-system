import * as React from "react";
import { StatusBar, Stack } from "@dbwk10317/bonggu-design-system";

/* 셸 맨 아래 줄. 지금 무엇을 보고 있는지와 데이터가 언제 것인지를 항상 띄워 둔다. */
export const Live = () => (
  <StatusBar
    live={{ label: "실시간" }}
    items={["게이트웨이 연결됨", <>노드 <span className="bds-mono">35 / 38</span> 온라인</>]}
    right={[<>수집 주기 <span className="bds-mono">5s</span></>, <span className="bds-mono">14:02:37</span>]}
  />
);

/* 실시간이 아니면 live 를 주지 않는다. 점이 사라져 "지금 값"이 아님을 알린다. */
export const Static = () => (
  <StatusBar
    items={["API 경유", <><span className="bds-mono">config-api</span> 경유 화면</>]}
    right={[<span className="bds-mono">14:02:37</span>]}
  />
);

export const Both = () => (
  <Stack gap={4}>
    <StatusBar live={{ label: "실시간" }} items={["수집 중"]} right={[<span className="bds-mono">5s</span>]} />
    <StatusBar live={{ label: "재연결 중" }} items={["게이트웨이 응답 없음", "마지막 값 22분 전"]} right={[<span className="bds-mono">13:40:11</span>]} />
    <StatusBar items={["읽기 전용"]} />
  </Stack>
);
