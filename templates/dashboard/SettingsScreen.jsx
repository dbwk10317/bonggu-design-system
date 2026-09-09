(() => {
const { PageStack, PageHeader, Container, Panel, CardHead, Grid, Stack, Inline, Spacer, Divider, Accordion, Field, TextField, TextArea, Select, SegmentedControl, Switch, Checkbox, NumberStepper, TimePicker, CopyField, DataTable, DescriptionList, KeyValues, StatusPill, Tag, Code, Button, Tooltip, Modal, FormModal, ConfirmDialog, AlertBanner, InlineMessage, EmptyState, ToastProvider } = window.DS;
const useToast = ToastProvider.useToast;

const TOKENS = [
  { id: "t1", name: "grafana-scraper", scope: "읽기", created: "2026-06-02", used: "2026-09-09 18:40", state: "활성" },
  { id: "t2", name: "ci-rollout", scope: "배포", created: "2026-07-18", used: "2026-09-09 18:30", state: "활성" },
  { id: "t3", name: "old-exporter", scope: "읽기", created: "2025-11-04", used: null, state: "폐기됨" },
];

function SettingsScreen() {
  const { toast } = useToast();
  const [density, setDensity] = React.useState(() => document.documentElement.dataset.density || "default");
  const [interval, setInterval_] = React.useState(5);
  const [keep, setKeep] = React.useState(30);
  const [window_, setWindow] = React.useState("02:00");
  const [autoResume, setAutoResume] = React.useState(true);
  const [notifyTone, setNotifyTone] = React.useState("warn");
  const [issue, setIssue] = React.useState(false);
  const [issued, setIssued] = React.useState(null);
  const [revoke, setRevoke] = React.useState(null);
  const [wipe, setWipe] = React.useState(false);

  React.useEffect(() => {
    if (density === "compact") document.documentElement.dataset.density = "compact";
    else delete document.documentElement.dataset.density;
  }, [density]);

  return (
    <PageStack aria-label="콘솔 설정">
      <PageHeader title="설정" description="수집 주기, 점검 창, 자동화 토큰처럼 콘솔 전체에 걸리는 값을 관리합니다."
        actions={<Tooltip content="바뀐 값은 저장하는 즉시 반영됩니다"><StatusPill tone="info">즉시 반영</StatusPill></Tooltip>} />

      <Container narrow>
        <Stack gap={5}>
          <Panel>
            <CardHead title="화면" meta="이 브라우저에만 저장됩니다" />
            <Stack gap={4}>
              <Field label="밀도" hint="조밀은 패딩과 컨트롤 높이만 줄입니다. 글자 크기는 그대로입니다.">
                <SegmentedControl aria-label="화면 밀도" value={density} onChange={setDensity} options={[{ value: "default", label: "기본" }, { value: "compact", label: "조밀" }]} />
              </Field>
              <Switch defaultChecked>실시간 수치가 바뀔 때 카드 테두리를 잠깐 강조하기</Switch>
              <Switch>표에서 결측 행을 아래로 모으기</Switch>
            </Stack>
          </Panel>

          <Panel>
            <CardHead title="수집" meta="게이트웨이 공통" />
            <Stack gap={4}>
              <Grid cols={2}>
                <Field label="수집 주기" hint="짧게 잡으면 노드 CPU를 더 씁니다."><NumberStepper value={interval} min={1} max={60} unit="초" onChange={setInterval_} /></Field>
                <Field label="보관 기간"><NumberStepper value={keep} min={7} max={365} step={7} unit="일" onChange={setKeep} /></Field>
              </Grid>
              <Grid cols={2}>
                <Field label="정기 점검 창 시작" hint="예약된 재시작과 롤아웃 재개가 이 시각에 움직입니다."><TimePicker value={window_} onChange={setWindow} step={30} /></Field>
                <Field label="알림을 받을 최소 등급">
                  <Select aria-label="알림 등급" value={notifyTone} onChange={(e) => setNotifyTone(e.target.value)}
                    options={[{ value: "info", label: "안내부터" }, { value: "warn", label: "주의부터" }, { value: "crit", label: "위험만" }]} />
                </Field>
              </Grid>
              <Checkbox checked={autoResume} onChange={(e) => setAutoResume(e.target.checked)}>점검 창에서 멈춘 롤아웃을 자동으로 재개하기</Checkbox>
              {interval < 5 && <InlineMessage tone="warn" icon="warning">5초보다 짧게 잡으면 저사양 노드에서 표본이 밀릴 수 있습니다.</InlineMessage>}
              <Inline><Spacer /><Button variant="primary" onClick={() => toast({ message: "수집 설정을 저장했습니다.", tone: "ok" })}>저장</Button></Inline>
            </Stack>
          </Panel>

          <Panel>
            <CardHead title="자동화 토큰" meta={`${TOKENS.length}개`} />
            <Stack gap={3}>
              <p>외부 시스템이 이 콘솔의 API를 부를 때 쓰는 토큰입니다. 원문은 발급 직후 한 번만 보입니다.</p>
              <DataTable aria-label="자동화 토큰" rowKey={(r) => r.id} rows={TOKENS}
                empty={<EmptyState plain title="발급한 토큰이 없습니다" description="토큰을 발급하면 여기에서 사용 이력을 볼 수 있습니다." />}
                columns={[
                  { key: "name", header: "이름", render: (r) => <span className="bds-mono">{r.name}</span> },
                  { key: "scope", header: "범위", render: (r) => <Tag>{r.scope}</Tag> },
                  { key: "created", header: "발급일", align: "num", hideBelow: "tablet" },
                  { key: "used", header: "마지막 사용", align: "num" },
                  { key: "state", header: "상태", render: (r) => <StatusPill size="sm" tone={r.state === "활성" ? "ok" : "off"}>{r.state}</StatusPill> },
                  { key: "act", header: "", width: 96, render: (r) => (r.state === "활성" ? <Button size="sm" variant="danger" onClick={() => setRevoke(r)}>폐기</Button> : null) },
                ]} />
              <Inline><Spacer /><Button variant="secondary" icon="key" onClick={() => setIssue(true)}>토큰 발급</Button></Inline>
            </Stack>
          </Panel>

          <Panel>
            <CardHead title="고급" meta="바꾸기 전에 담당자와 상의합니다" />
            <Accordion plain multiple items={[
              { id: "net", title: "네트워크", meta: "프록시와 재시도", icon: "wifi-high", content: (
                <Stack gap={3}>
                  <Field label="프록시 주소" hint="비우면 노드가 게이트웨이에 직접 붙습니다."><TextField mono placeholder="http://proxy.example:3128" /></Field>
                  <Grid cols={2}>
                    <Field label="재시도 횟수"><NumberStepper defaultValue={3} min={0} max={10} unit="회" /></Field>
                    <Field label="타임아웃"><NumberStepper defaultValue={10} min={1} max={120} unit="초" /></Field>
                  </Grid>
                </Stack>
              ) },
              { id: "sig", title: "장치 프로파일", meta: "캐시와 대체 문구", icon: "sliders", content: (
                <Stack gap={3}>
                  <Field label="오프라인 캐시" hint="회선이 끊겨도 이 용량만큼은 계속 재생합니다."><NumberStepper defaultValue={512} min={64} max={4096} step={64} unit="MB" /></Field>
                  <Field label="대체 문구" hint="캐시까지 비었을 때 화면에 남길 한 줄"><TextArea rows={2} defaultValue="잠시 후 다시 표시됩니다." /></Field>
                </Stack>
              ) },
              { id: "sys", title: "시스템 정보", meta: "읽기 전용", icon: "info", content: (
                <Stack gap={3}>
                  <DescriptionList items={[
                    { term: "콘솔", detail: "bonggu-edge-console 2.14.0", mono: true },
                    { term: "게이트웨이", detail: "gw-01 · 서울 리전", mono: true },
                    { term: "데이터베이스", detail: "PostgreSQL 16.3", mono: true },
                    { term: "빌드", detail: "2026-09-05 · a41c9e2", mono: true },
                  ]} />
                  <KeyValues lined rows={[["연결된 노드", "38"], ["보관 중인 표본", "1.4억"], ["디스크 사용", "412 GiB"], ["마지막 백업", null]]} />
                  <p className="kit-dim">설정 파일 경로는 <Code>/etc/bonggu/console.toml</Code>입니다.</p>
                </Stack>
              ) },
            ]} />
          </Panel>

          <Panel>
            <CardHead title="위험 구역" />
            <Stack gap={3}>
              <AlertBanner tone="crit" title="되돌릴 수 없는 동작">아래 동작은 확인 문구를 그대로 입력해야 실행됩니다.</AlertBanner>
              <Divider />
              <Inline align="center">
                <Stack gap={1}>
                  <b>수집 기록 전체 삭제</b>
                  <span className="kit-dim">노드 설정은 남고 지표와 로그만 지웁니다.</span>
                </Stack>
                <Spacer />
                <Button variant="danger" icon="trash" onClick={() => setWipe(true)}>기록 삭제</Button>
              </Inline>
            </Stack>
          </Panel>
        </Stack>
      </Container>

      <FormModal open={issue} onClose={() => setIssue(false)} title="자동화 토큰 발급" description="발급한 토큰의 원문은 이 창에서 한 번만 보여 줍니다." submitLabel="발급"
        onSubmit={(e) => { e.preventDefault(); setIssue(false); setIssued("bge_" + Math.random().toString(36).slice(2, 10) + "8f21c0a4d9"); }}>
        <Stack gap={3}>
          <Field label="이름" required hint="어디에서 쓰는 토큰인지 알아볼 수 있게 적습니다."><TextField mono placeholder="ci-rollout" /></Field>
          <Field label="범위" required><Select aria-label="토큰 범위" defaultValue="read" options={[{ value: "read", label: "읽기" }, { value: "deploy", label: "배포" }, { value: "admin", label: "전체" }]} /></Field>
          <Field label="만료" hint="만료 없는 토큰은 감사에서 지적됩니다."><Select aria-label="만료" defaultValue="90" options={[{ value: "30", label: "30일" }, { value: "90", label: "90일" }, { value: "0", label: "만료 없음" }]} /></Field>
        </Stack>
      </FormModal>

      <Modal open={!!issued} onClose={() => setIssued(null)} size="md" title="토큰을 발급했습니다" description="창을 닫으면 원문을 다시 볼 수 없습니다."
        actions={<Button variant="primary" onClick={() => setIssued(null)}>닫기</Button>}>
        <Stack gap={3}>
          <CopyField secret label="토큰 원문" value={issued ?? ""} onCopy={() => toast({ message: "토큰을 복사했습니다.", tone: "ok" })} />
          <InlineMessage tone="info" icon="info">저장소나 CI 비밀 변수에 바로 넣고, 메신저에는 올리지 않습니다.</InlineMessage>
        </Stack>
      </Modal>

      <ConfirmDialog open={!!revoke} danger confirmLabel="폐기" title="토큰을 폐기합니다"
        message={revoke && <>폐기하면 <Code>{revoke.name}</Code>을 쓰는 자동화가 즉시 401을 받습니다.</>}
        onClose={() => setRevoke(null)} onConfirm={() => { toast({ message: `${revoke.name} 토큰을 폐기했습니다.`, tone: "warn" }); setRevoke(null); }} />

      <ConfirmDialog open={wipe} danger confirmLabel="삭제" typeToConfirm="기록 삭제" title="수집 기록을 모두 지웁니다"
        message="지난 30일치 지표와 로그가 사라집니다. 백업에서 되살릴 수 없습니다."
        onClose={() => setWipe(false)} onConfirm={() => { setWipe(false); toast({ message: "수집 기록을 삭제했습니다.", tone: "warn" }); }} />
    </PageStack>
  );
}
window.SettingsScreen = SettingsScreen;
})();
