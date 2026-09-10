import * as React from "react";
import { Checkbox, Stack, Field, Panel } from "@dbwk10317/bonggu-design-system";

export const Basic = () => (
  <Stack gap={3}>
    <Checkbox defaultChecked>초대 메일에 콘솔 사용 안내를 함께 보냅니다</Checkbox>
    <Checkbox>배포 실패 시 자동으로 되돌립니다</Checkbox>
    <Checkbox disabled>이 조직에서는 쓸 수 없는 설정</Checkbox>
    <Checkbox defaultChecked disabled>관리자가 잠근 설정</Checkbox>
  </Stack>
);

/* 부분 선택은 indeterminate 다. 체크와 해제 중간을 checked 로 흉내 내지 않는다. */
export const Indeterminate = () => {
  const REGIONS = ["서울", "경기", "부산"];
  const [on, setOn] = React.useState<string[]>(["서울"]);
  const all = on.length === REGIONS.length;
  return (
    <Panel padding="sm">
      <Stack gap={3}>
        <Checkbox
          checked={all}
          indeterminate={on.length > 0 && !all}
          onChange={() => setOn(all ? [] : REGIONS)}
        >모든 지역</Checkbox>
        <Stack gap={2} style={{ paddingInlineStart: 24 }}>
          {REGIONS.map((r) => (
            <Checkbox key={r} checked={on.includes(r)} onChange={() => setOn((v) => (v.includes(r) ? v.filter((x) => x !== r) : [...v, r]))}>{r}</Checkbox>
          ))}
        </Stack>
      </Stack>
    </Panel>
  );
};

/* radio 를 켜면 단일 선택이다. 같은 name 으로 묶는다. */
export const Radio = () => (
  <Field label="적용 대상">
    <Stack gap={2}>
      <Checkbox radio name="target" defaultChecked>선택한 노드만</Checkbox>
      <Checkbox radio name="target">같은 지역 전체</Checkbox>
      <Checkbox radio name="target">모든 노드</Checkbox>
    </Stack>
  </Field>
);

/* 라벨 없이 쓰면 aria-label 을 반드시 준다(표의 행 선택 등). */
export const NoLabel = () => <Checkbox aria-label="edge-seoul-01 선택" />;
