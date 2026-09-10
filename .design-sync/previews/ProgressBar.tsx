import * as React from "react";
import { ProgressBar, Stack } from "@dbwk10317/bonggu-design-system";

export const Basic = () => (
  <Stack gap={5}>
    <ProgressBar value={0.62} label="에이전트 배포" detail="24 / 38 노드" showValue />
    <ProgressBar value={0.94} label="이미지 업로드" detail="3/9 청크 · 42 MiB/s" tone="ok" showValue />
    <ProgressBar value={0.31} label="롤아웃" tone="warn" detail="배치 3/6에서 멈춤" showValue />
  </Stack>
);

/* 값이 없으면 비결정형이다. 진행률을 모르는 작업에 0%를 그리지 않는다. */
export const Indeterminate = () => (
  <ProgressBar value={null} label="노드 재색인" detail="남은 시간을 아직 알 수 없습니다" />
);

export const Sizes = () => (
  <Stack gap={4}>
    <ProgressBar size="sm" value={0.45} aria-label="작은 진행 바" />
    <ProgressBar size="md" value={0.45} aria-label="기본 진행 바" />
  </Stack>
);

export const CustomFormat = () => (
  <ProgressBar
    value={0.62} label="펌웨어 전송" showValue
    valueFormatter={(v) => `${(v * 148).toFixed(0)} / 148 MB`}
  />
);
