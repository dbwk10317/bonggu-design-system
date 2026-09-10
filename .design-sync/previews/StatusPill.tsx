import * as React from "react";
import { StatusPill, Inline } from "@dbwk10317/bonggu-design-system";

export const Tones = () => (
  <Inline gap={2}>
    <StatusPill tone="ok">모든 서비스 정상</StatusPill>
    <StatusPill tone="warn">CPU 82%</StatusPill>
    <StatusPill tone="crit">연결 끊김</StatusPill>
    <StatusPill tone="off">수집 안 됨</StatusPill>
    <StatusPill tone="info">점검 예정</StatusPill>
    <StatusPill tone="accent">베타</StatusPill>
  </Inline>
);

export const Sizes = () => (
  <Inline gap={2} align="center">
    <StatusPill tone="ok" size="sm">sm 실행 중</StatusPill>
    <StatusPill tone="ok" size="md">md 실행 중</StatusPill>
    <StatusPill tone="ok" size="lg">lg 실행 중</StatusPill>
  </Inline>
);

export const Styles = () => (
  <Inline gap={2}>
    <StatusPill tone="ok" pulse>실시간 갱신 중</StatusPill>
    <StatusPill tone="warn" outline>외곽선</StatusPill>
    <StatusPill tone="crit" dot={false}>점 없음</StatusPill>
  </Inline>
);
