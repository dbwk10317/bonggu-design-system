import * as React from "react";
import { Container, Panel, CardHead, Stack, Field, TextField } from "@dbwk10317/bonggu-design-system";

/* 기본은 최대 폭 중앙 정렬. 넓은 화면에서 본문이 끝없이 늘어나지 않게 한다. */
export const Basic = () => (
  <Container>
    <Panel><CardHead title="기본 폭" meta="화면 가운데" /><p>넓은 화면에서도 읽기 좋은 폭을 유지합니다.</p></Panel>
  </Container>
);

/* 설정·폼처럼 한 줄이 길면 읽기 나쁜 화면은 narrow(760px). */
export const Narrow = () => (
  <Container narrow>
    <Stack gap={4}>
      <Panel>
        <CardHead title="수집 설정" meta="760px" />
        <Stack gap={4}>
          <Field label="수집 주기" hint="너무 짧으면 엣지 노드의 배터리를 깎습니다."><TextField defaultValue="5" suffix="초" mono /></Field>
          <Field label="보존 기간"><TextField defaultValue="30" suffix="일" mono /></Field>
        </Stack>
      </Panel>
    </Stack>
  </Container>
);

/* 셸 밖(공개 상태 페이지 등)에서는 좌우 여백을 직접 줘야 한다. */
export const Padded = () => (
  <Container pad>
    <Panel><CardHead title="pad" meta="좌우 --page-pad" /><p>셸이 여백을 주지 않는 자리에서 씁니다.</p></Panel>
  </Container>
);
