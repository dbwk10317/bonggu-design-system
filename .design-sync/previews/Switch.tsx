import * as React from "react";
import { Switch, Stack, Panel, Inline, CardHead } from "@dbwk10317/bonggu-design-system";

/* 즉시 반영되는 설정에 쓴다. 저장 버튼이 따로 있는 폼에는 Checkbox 다. */
export const Basic = () => (
  <Stack gap={3}>
    <Switch defaultChecked>배포 실패 시 자동으로 되돌립니다</Switch>
    <Switch>휴일에는 장치를 켜지 않습니다</Switch>
    <Switch disabled>이 조직에서는 잠긴 설정</Switch>
    <Switch defaultChecked disabled>관리자가 켜 둔 설정</Switch>
  </Stack>
);

export const InSettings = () => {
  const [sync, setSync] = React.useState(true);
  return (
    <Panel>
      <CardHead title="장치 설정" meta="즉시 적용" />
      <Stack gap={4}>
        <Switch checked={sync} onChange={(e) => setSync(e.currentTarget.checked)}>두 장치에 같은 값을 씁니다</Switch>
        <Switch defaultChecked>야간에는 화면을 끕니다</Switch>
        <Inline gap={2} align="center">
          <Switch aria-label="원격 재부팅 허용" />
          <span>원격 재부팅 허용</span>
        </Inline>
      </Stack>
    </Panel>
  );
};
