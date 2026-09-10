import * as React from "react";
import { Spacer, Inline, Stack, Button, Panel, Tag } from "@dbwk10317/bonggu-design-system";

/* 크기를 주지 않으면 남는 공간을 다 먹는다. 툴바 오른쪽 정렬을 이걸로 만든다. */
export const Push = () => (
  <Panel padding="sm">
    <Inline gap={2} align="center" wrap={false}>
      <b>노드 38대</b><Tag>서울 12</Tag>
      <Spacer />
      <Button size="sm" variant="secondary">내보내기</Button>
      <Button size="sm" variant="primary">추가</Button>
    </Inline>
  </Panel>
);

/* size 를 주면 고정 간격이다. --sp 단계 번호를 쓴다. */
export const Fixed = () => (
  <Stack gap={0} style={{ background: "var(--fill-1)", padding: 12, borderRadius: "var(--r-sm)" }}>
    <b>수집 설정</b>
    <Spacer size={2} />
    <p>노드가 게이트웨이로 값을 올리는 주기입니다.</p>
    <Spacer size={6} />
    <b>보존</b>
    <Spacer size={2} />
    <p>지난 값을 얼마나 오래 남길지 정합니다.</p>
  </Stack>
);
