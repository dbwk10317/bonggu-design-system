import * as React from "react";
import { TextField, Field, Stack, Grid, Inline } from "@dbwk10317/bonggu-design-system";

/* Field attaches label/hint/error; don't set a label directly on TextField. */
export const InField = () => (
  <Stack gap={4}>
    <Field label="노드 이름" hint="매장에서 부르는 이름을 씁니다.">
      <TextField defaultValue="봉구 강남점" />
    </Field>
    <Field label="에이전트 엔드포인트" error="https:// 로 시작해야 합니다." required>
      <TextField defaultValue="edge.bonggu.me/agent" mono />
    </Field>
  </Stack>
);

export const IconAndAffix = () => (
  <Stack gap={4}>
    <TextField icon="magnifying-glass" placeholder="노드 이름 또는 매장" aria-label="노드 검색" />
    <TextField prefix="https://" suffix=".bonggu.me" defaultValue="edge" mono aria-label="하위 도메인" />
    <TextField suffix="ms" defaultValue="5000" mono fit="fixed" width={140} aria-label="응답 제한" />
  </Stack>
);

export const Sizes = () => (
  <Grid min={220}>
    <TextField size="sm" placeholder="sm" aria-label="작은 입력" />
    <TextField size="md" placeholder="md" aria-label="기본 입력" />
  </Grid>
);

export const States = () => (
  <Stack gap={4}>
    <TextField placeholder="비어 있음" aria-label="비어 있음" />
    <TextField defaultValue="읽기 전용" readOnly aria-label="읽기 전용" />
    <TextField defaultValue="비활성" disabled aria-label="비활성" />
    <TextField defaultValue="edge seoul 03" invalid aria-label="잘못된 값" />
  </Stack>
);

/* fit="auto" sizes to content; use it where the field shouldn't eat width, like in a toolbar. */
export const Auto = () => (
  <Inline gap={2} align="center">
    <span>재시도</span>
    <TextField fit="auto" width={64} defaultValue="3" mono aria-label="재시도 횟수" />
    <span>회</span>
  </Inline>
);
