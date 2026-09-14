import * as React from "react";
import { StatusBar, Stack } from "@dbwk10317/bonggu-design-system";

/* Bottom line of the shell; always shows what you're looking at and when the data is from. */
export const Live = () => (
  <StatusBar
    live={{ label: "실시간" }}
    items={["게이트웨이 연결됨", <>노드 <span className="bds-mono">35 / 38</span> 온라인</>]}
    right={[<>수집 주기 <span className="bds-mono">5s</span></>, <span className="bds-mono">14:02:37</span>]}
  />
);

/* Skip live when it's not real-time; the dot disappearing signals this isn't a current value. */
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
