import * as React from "react";
import { UptimeBar, Stack } from "@dbwk10317/bonggu-design-system";

type Seg = { status: "ok" | "warn" | "crit" | "off"; label?: string };
const day = (i: number): Seg =>
  i === 47 ? { status: "crit", label: "게이트웨이 장애 22분" }
  : i === 46 || i === 61 ? { status: "warn", label: "수집 지연" }
  : { status: "ok", label: "정상" };
const NINETY = Array.from({ length: 90 }, (_, i) => day(i));

export const Basic = () => (
  <UptimeBar name="결제 API" segments={NINETY} start="90일 전" end="오늘" />
);

/* off 는 아직 수집하지 않은 구간이라 가용성 분모에서 빠진다. 장애로 세지 않는다. */
export const NotYetCollected = () => (
  <UptimeBar
    name="신규 배포 채널"
    segments={[...Array.from({ length: 60 }, (): Seg => ({ status: "off", label: "미수집" })), ...NINETY.slice(60)]}
    start="60일 전" end="오늘"
  />
);

export const Stacked = () => (
  <Stack gap={4}>
    <UptimeBar name="안내 단말 API" segments={NINETY} height={10} />
    <UptimeBar name="결제 리더기 API" segments={NINETY.map((s, i) => (i > 80 ? { status: "warn", label: "지연" } : s))} height={10} />
    <UptimeBar name="상태 페이지" segments={NINETY} height={10} uptime={100} />
  </Stack>
);
