import * as React from "react";
import { Popover, Button, IconButton, Stack, Inline, Checkbox, Field, NumberStepper, Divider } from "@dbwk10317/bonggu-design-system";

/* 툴팁과 달리 안의 것을 누를 수 있다. 짧은 폼이나 설명을 담는다. */
export const Filters = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen} title="필터" trigger={<Button variant="secondary" icon="funnel">필터</Button>}>
      <Stack gap={3}>
        <Checkbox defaultChecked>온라인</Checkbox>
        <Checkbox defaultChecked>수집 지연</Checkbox>
        <Checkbox>연결 끊김</Checkbox>
        <Divider />
        <Field label="지연 임계"><NumberStepper defaultValue={200} min={50} step={50} unit="ms" size="sm" /></Field>
      </Stack>
    </Popover>
  );
};

/* 비제어로 두면 트리거가 알아서 연다. */
export const Uncontrolled = () => (
  <Inline gap={3}>
    <Popover title="이 값은 무엇인가요" trigger={<IconButton icon="question" variant="ghost" aria-label="설명" />}>
      <p>가용성은 (정상 + 지연) ÷ 수집된 구간입니다. 미수집 구간은 분모에서 빠집니다.</p>
    </Popover>
    <Popover trigger={<Button variant="ghost" size="sm">자세히</Button>}>
      <p>노드 2대가 5초 주기를 놓치고 있습니다.</p>
    </Popover>
  </Inline>
);

/* 오른쪽 끝에 붙은 트리거는 화면 밖으로 나가지 않게 end 로 맞춘다. */
export const Alignment = () => (
  <Stack gap={4}>
    <Inline><Popover side="bottom" title="bottom" trigger={<Button variant="secondary" size="sm">bottom</Button>}><p>아래에서 왼쪽 정렬</p></Popover></Inline>
    <Inline justify="end"><Popover side="bottom-end" title="bottom-end" trigger={<Button variant="secondary" size="sm">bottom-end</Button>}><p>아래에서 오른쪽 정렬</p></Popover></Inline>
  </Stack>
);
