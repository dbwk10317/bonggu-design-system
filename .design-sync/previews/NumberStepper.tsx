import * as React from "react";
import { NumberStepper, Field, Stack, Grid, Inline } from "@dbwk10317/bonggu-design-system";

export const Basic = () => (
  <Grid min={200}>
    <Field label="수집 주기"><NumberStepper defaultValue={5} min={1} max={60} unit="초" /></Field>
    <Field label="보존 기간"><NumberStepper defaultValue={30} min={7} max={365} step={7} unit="일" /></Field>
    <Field label="배치 크기"><NumberStepper defaultValue={8} min={1} max={38} /></Field>
  </Grid>
);

/* onChange 는 확정된 값만 준다. 입력 중 빈칸이나 범위 밖 값으로 상태를 흔들지 않는다. */
export const Controlled = () => {
  const [n, setN] = React.useState(5);
  return (
    <Field label="수집 주기" hint={`38대 × ${n}초 주기 → 분당 약 ${Math.round((38 * 60) / n)}건`}>
      <NumberStepper value={n} onChange={setN} min={1} max={60} unit="초" />
    </Field>
  );
};

export const Sizes = () => (
  <Inline gap={4} align="center">
    <NumberStepper size="sm" defaultValue={3} aria-label="작게" />
    <NumberStepper size="md" defaultValue={3} aria-label="기본" />
  </Inline>
);

export const States = () => (
  <Stack gap={3}>
    <NumberStepper defaultValue={5} fit="fixed" width={140} unit="초" aria-label="고정 폭" />
    <NumberStepper defaultValue={0} min={1} invalid unit="초" aria-label="범위 밖" />
    <NumberStepper defaultValue={5} disabled unit="초" aria-label="비활성" />
  </Stack>
);
