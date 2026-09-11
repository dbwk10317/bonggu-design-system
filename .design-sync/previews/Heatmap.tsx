import * as React from "react";
import { Heatmap, Panel, CardHead, Legend, Stack } from "@dbwk10317/bonggu-design-system";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const HOURS = Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2, "0")}시`);

/* 값은 [행][열]이다. 일요일 야간 두 칸은 수집기가 꺼져 있던 구간이라 null 로 둔다. */
const LOAD: (number | null)[][] = DAYS.map((_, row) =>
  HOURS.map((__, col) => {
    if (row === 6 && col > 9) return null;
    const busy = col > 3 && col < 10;
    return Math.round((busy ? 60 : 18) * (0.5 + ((row * 31 + col * 7) % 17) / 17));
  }),
);

export const Basic = () => (
  <Heatmap aria-label="요일과 시간대별 요청량" rows={DAYS} cols={HOURS} values={LOAD} cell={18} valueFormatter={(v) => `${v}만 건`} />
);

/* 0 과 결측은 다르다. 값이 0 이면 가장 옅은 칸, 수집이 안 됐으면 빈 칸이다. */
export const WithGaps = () => (
  <Panel>
    <CardHead title="요청량" meta="최근 7일" />
    <Stack gap={4}>
      <Heatmap
        aria-label="결측이 섞인 요청량"
        rows={DAYS} cols={HOURS} cell={18}
        values={LOAD.map((r, i) => (i === 2 ? r.map(() => null) : r))}
        valueFormatter={(v) => `${v}만 건`}
      />
      <Legend items={[{ label: "적음" }, { label: "많음" }]} />
    </Stack>
  </Panel>
);

/* 축 라벨이 빽빽하면 rowLabel·colLabel 로 솎는다. */
export const ThinnedLabels = () => (
  <Heatmap
    aria-label="라벨을 솎은 요청량"
    rows={DAYS} cols={HOURS} values={LOAD} cell={16} gap={2}
    colLabel={(c) => (HOURS.indexOf(c as string) % 3 === 0 ? c : "")}
    valueFormatter={(v) => `${v}만 건`}
  />
);

export const Fixed = () => (
  <Heatmap aria-label="고정 폭 요청량" rows={DAYS} cols={HOURS} values={LOAD} fit="fixed" width={420} cell={14} valueFormatter={(v) => `${v}만 건`} />
);
