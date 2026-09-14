import * as React from "react";
import { Spacer, Inline, Stack, Button, Panel, Tag } from "@dbwk10317/bonggu-design-system";

/* Without a size it fills all remaining space; this is how toolbar right-alignment is built. */
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

/* With size it's a fixed gap; use a --sp step number. */
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
