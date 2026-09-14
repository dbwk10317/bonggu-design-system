import * as React from "react";
import { Modal, Button, Stack, Inline, OTPInput, KeyValues, InlineMessage } from "@dbwk10317/bonggu-design-system";

/* A native dialog: focus is trapped inside and Esc/dim-click close it. open is controlled directly. */
export const Basic = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>모달 열기</Button>
      <Modal
        open={open} onClose={() => setOpen(false)} size="sm"
        title="2단계 인증 재설정"
        description="정유현의 인증 앱을 초기화하려면 소유자 인증 코드가 필요합니다."
        actions={<><Button variant="secondary" onClick={() => setOpen(false)}>취소</Button><Button variant="primary" onClick={() => setOpen(false)}>재설정</Button></>}
      >
        <Stack gap={3} align="center">
          <OTPInput length={6} aria-label="소유자 인증 코드" />
          <p>소유자 계정의 인증 앱에 뜬 6자리를 넣습니다.</p>
        </Stack>
      </Modal>
    </>
  );
};

/* Increase size for a read-only detail view; also consider Drawer when the goal is review, not a decision. */
export const Details = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>상세 열기</Button>
      <Modal
        open={open} onClose={() => setOpen(false)} size="md"
        title="edge-seoul-03"
        description="봉구 성수점 · BG-EDGE-2"
        actions={<Button variant="secondary" onClick={() => setOpen(false)}>닫기</Button>}
      >
        <Stack gap={4}>
          <InlineMessage tone="crit">22분째 응답하지 않습니다.</InlineMessage>
          <KeyValues lined rows={[
            { k: "에이전트", v: "2.14.0", mono: true },
            { k: "CPU", v: "74%", mono: true },
            { k: "디스크", v: "91%", mono: true },
            { k: "마지막 수집", v: "13:40:11", mono: true },
          ]} />
        </Stack>
      </Modal>
    </>
  );
};

/* With no actions it's just an announcement; leave only the close button. */
export const NoActions = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Inline><Button variant="secondary" onClick={() => setOpen(true)}>안내 열기</Button></Inline>
      <Modal open={open} onClose={() => setOpen(false)} size="sm" title="점검 안내" closeButton>
        <p>9월 14일 02:00~03:00 사이 게이트웨이가 재시작됩니다. 수집은 자동으로 이어집니다.</p>
      </Modal>
    </>
  );
};
