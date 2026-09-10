import * as React from "react";
import { TrendDelta, Stack, Inline } from "@dbwk10317/bonggu-design-system";

export const Directions = () => (
  <Inline gap={4}>
    <TrendDelta value={0.124} percent label="1시간 전 대비" />
    <TrendDelta value={-0.031} percent label="1시간 전 대비" />
    <TrendDelta value={0} percent label="변화 없음" />
  </Inline>
);

/* 응답시간·오류율은 늘어나는 쪽이 나쁘다. inverse가 색을 뒤집는다. */
export const Inverse = () => (
  <Stack gap={2}>
    <TrendDelta value={0.18} percent inverse label="p95 응답시간" />
    <TrendDelta value={-0.22} percent inverse label="오류율" />
  </Stack>
);

export const Absolute = () => (
  <Inline gap={4}>
    <TrendDelta value={1284} label="어제 대비 요청" />
    <TrendDelta value={-37} label="어제 대비 노드" />
  </Inline>
);

export const Missing = () => <TrendDelta value={null} label="1시간 전 대비" />;
