import * as React from "react";
import { Container, Panel, CardHead, Stack, Field, TextField } from "@dbwk10317/bonggu-design-system";

/* Default centers content at a max width so it doesn't stretch endlessly on wide screens. */
export const Basic = () => (
  <Container>
    <Panel><CardHead title="기본 폭" meta="화면 가운데" /><p>넓은 화면에서도 읽기 좋은 폭을 유지합니다.</p></Panel>
  </Container>
);

/* Use narrow (760px) for settings/forms where long lines hurt readability. */
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

/* Outside the shell (e.g. a public status page), add side padding yourself with pad. */
export const Padded = () => (
  <Container pad>
    <Panel><CardHead title="pad" meta="좌우 --page-pad" /><p>셸이 여백을 주지 않는 자리에서 씁니다.</p></Panel>
  </Container>
);
