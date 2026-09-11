import * as React from "react";
import { FormModal, Button, Stack, Grid, Field, TextField, Select, MultiSelect, Checkbox, PasswordField } from "@dbwk10317/bonggu-design-system";

const ROLES = [{ value: "admin", label: "관리자" }, { value: "op", label: "운영자" }, { value: "view", label: "읽기 전용" }];
const REGIONS = [{ value: "seoul", label: "서울" }, { value: "gyeonggi", label: "경기" }, { value: "busan", label: "부산" }];

/* 제출이 있는 창은 Modal 이 아니라 FormModal 이다. Enter 제출과 busy 잠금이 딸려 온다. */
export const Invite = () => {
  const [open, setOpen] = React.useState(true);
  const [regions, setRegions] = React.useState<string[]>(["seoul"]);
  return (
    <>
      <Button variant="primary" icon="user-plus" onClick={() => setOpen(true)}>사람 초대</Button>
      <FormModal
        open={open} onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); setOpen(false); }}
        title="사람 초대" description="초대 메일로 콘솔에 들어옵니다." submitLabel="초대" size="md"
      >
        <Stack gap={4}>
          <Grid min={220}>
            <Field label="이름" required><TextField placeholder="정유현" /></Field>
            <Field label="메일" required><TextField type="email" placeholder="name@bonggu.me" /></Field>
          </Grid>
          <Field label="역할"><Select options={ROLES} defaultValue="op" /></Field>
          <Field label="담당 지역" hint="선택한 지역의 노드만 만질 수 있습니다.">
            <MultiSelect aria-label="담당 지역" options={REGIONS} value={regions} onChange={setRegions} max={4} />
          </Field>
          <Field label="임시 비밀번호"><PasswordField strength autoComplete="new-password" /></Field>
          <Checkbox defaultChecked>초대 메일에 콘솔 사용 안내를 함께 보냅니다</Checkbox>
        </Stack>
      </FormModal>
    </>
  );
};

/* 제출 중에는 busy 로 잠근다. 두 번 눌러 두 번 만들어지는 일을 막는다. */
export const Busy = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>제출 중 보기</Button>
      <FormModal open={open} onClose={() => setOpen(false)} onSubmit={(e) => e.preventDefault()} busy title="토큰 발급" submitLabel="발급" size="sm">
        <Field label="이름"><TextField defaultValue="배포 파이프라인" /></Field>
      </FormModal>
    </>
  );
};

/* 되돌릴 수 없는 제출은 danger. error 는 제출이 실패한 이유를 창 안에 남긴다. */
export const DangerWithError = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>일괄 격리</Button>
      <FormModal
        open={open} onClose={() => setOpen(false)} onSubmit={(e) => e.preventDefault()}
        danger title="노드 3대를 격리합니다" description="격리한 노드는 트래픽을 받지 않습니다."
        submitLabel="격리" error="edge-busan-02 는 이미 격리되어 있어 건너뜁니다." size="sm"
      >
        <Field label="사유" hint="감사 로그에 남습니다."><TextField placeholder="펌웨어 점검" /></Field>
      </FormModal>
    </>
  );
};
