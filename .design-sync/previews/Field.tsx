import * as React from "react";
import { Field, TextField, Select, Switch, NumberStepper, Stack, Grid } from "@dbwk10317/bonggu-design-system";

/* 라벨·설명·오류를 입력에 연결한다. 자식 입력은 id·aria 를 컨텍스트로 받으므로 직접 달지 않는다. */
export const Basic = () => (
  <Stack gap={4} style={{ maxWidth: 420 }}>
    <Field label="노드 이름"><TextField defaultValue="봉구 강남점" /></Field>
    <Field label="수집 주기" hint="너무 짧으면 엣지 노드의 배터리를 깎습니다."><NumberStepper defaultValue={5} min={1} unit="초" /></Field>
    <Field label="지역" required>
      <Select options={[{ value: "seoul", label: "서울" }, { value: "busan", label: "부산" }]} />
    </Field>
  </Stack>
);

/* error 가 있으면 hint 대신 나오고 입력이 aria-invalid 가 된다. 둘을 같이 띄우지 않는다. */
export const WithError = () => (
  <Stack gap={4} style={{ maxWidth: 420 }}>
    <Field label="에이전트 엔드포인트" hint="https:// 로 시작합니다."><TextField defaultValue="https://edge.bonggu.me" mono /></Field>
    <Field label="에이전트 엔드포인트" error="https:// 로 시작해야 합니다." hint="이 설명은 오류에 가려집니다."><TextField defaultValue="edge.bonggu.me" mono /></Field>
  </Stack>
);

export const Layouts = () => (
  <Grid min={220}>
    <Field label="켜는 시각"><TextField type="time" defaultValue="08:00" /></Field>
    <Field label="끄는 시각"><TextField type="time" defaultValue="23:30" /></Field>
    <Field label="야간 소등" hint="즉시 적용됩니다."><Switch defaultChecked>휴일 제외</Switch></Field>
  </Grid>
);
