(() => {
const { PageStack, PageHeader, Panel, CardHead, Grid, Stack, Inline, Spacer, Divider, Field, TextField, TextArea, Select, Checkbox, Combobox, DatePicker, CodeEditor, FileUpload, Stepper, ProgressBar, LogViewer, DiffView, DataTable, StatTile, Timeline, CodeBlock, Code, StatusPill, Tag, Button, IconButton, Tooltip, DropdownMenu, FormModal, ConfirmDialog, AlertBanner, InlineMessage, ToastProvider } = window.DS;
const useToast = ToastProvider.useToast;
const { releases, manifest, diff, logs, nodes } = window.KIT;

const HISTORY = [
  { id: "r-118", version: "2.14.0", when: "2026-09-09 18:20", batches: "6/6", nodes: 26, result: "완료", tone: "ok" },
  { id: "r-117", version: "2.13.2", when: "2026-09-02 10:05", batches: "6/6", nodes: 38, result: "완료", tone: "ok" },
  { id: "r-116", version: "2.13.1", when: "2026-08-28 09:40", batches: "2/6", nodes: 8, result: "되돌림", tone: "crit" },
  { id: "r-115", version: "2.13.0", when: "2026-08-21 11:12", batches: "6/6", nodes: 38, result: "완료", tone: "ok" },
];

function DeploysScreen() {
  const { toast } = useToast();
  const [release, setRelease] = React.useState("2.15.0-rc1");
  const [config, setConfig] = React.useState(manifest);
  const [valid, setValid] = React.useState(true);
  const [paused, setPaused] = React.useState(true);
  const [plan, setPlan] = React.useState(false);
  const [rollback, setRollback] = React.useState(false);
  const [when, setWhen] = React.useState("2026-09-10");
  const [uploads, setUploads] = React.useState([
    { id: "f1", name: "bonggu-edge-agent-2.15.0-rc1.tar.zst", size: 148000000, status: "uploading", progress: 0.62, chunk: 19, chunks: 31, rate: "42 MiB/s" },
    { id: "f2", name: "device-profiles-2026-09.zip", size: 24000000, status: "done", progress: 1 },
    { id: "f3", name: "edge-agent-debug.sym", size: 9800000, status: "failed", error: "저장소가 407을 돌려주었습니다" },
  ]);
  const patch = (id, over) => setUploads((u) => u.map((f) => (f.id === id ? { ...f, ...over } : f)));

  const steps = [
    { label: "아티팩트 확인", detail: "서명과 해시 대조", status: "done" },
    { label: "카나리 2대", detail: "edge-seoul-01 · edge-gyeonggi-01", status: "done" },
    { label: "배치 3/6", detail: "edge-seoul-03에서 멈춤", status: "error" },
    { label: "남은 배치", detail: "노드 14대", status: "todo" },
    { label: "정리", detail: "이전 버전 회수", status: "todo" },
  ];

  return (
    <PageStack aria-label="배포">
      <PageHeader title="배포" description="에이전트와 장치 프로파일을 배치 단위로 내려보냅니다. 오류가 나면 롤아웃은 자동으로 멈춥니다."
        actions={<>
          <Tooltip content="배포 문서를 새 탭에서 엽니다"><IconButton icon="question" variant="ghost" aria-label="배포 문서" /></Tooltip>
          <Button variant="secondary" icon="calendar" onClick={() => setPlan(true)}>배포 예약</Button>
          <Button variant="danger" icon="arrow-counter-clockwise" onClick={() => setRollback(true)}>되돌리기</Button>
        </>} />

      <AlertBanner tone="crit" title="롤아웃이 멈춰 있습니다" onClose={() => {}}>
        <b>edge-seoul-03</b> verify 단계에서 메모리 부족으로 실패했습니다. <Code>pause_on_error</Code>가 켜져 있어 남은 배치는 대기 중입니다.
      </AlertBanner>

      <div className="bds-metric-grid">
        <StatTile icon="rocket-launch" label="반영된 노드" value={24} unit="대" detail={<>전체 {nodes.length + 26}대 중</>} tone={2} />
        <StatTile icon="hourglass" label="대기 배치" value={3} unit="개" pill={{ tone: "warn", text: "멈춤" }} />
        <StatTile icon="warning" label="실패" value={1} unit="대" pill={{ tone: "crit", text: "확인 필요" }} detail={<Tag>edge-seoul-03</Tag>} tone={5} />
        <StatTile icon="clock" label="경과" value="12분" detail={<>시작 <span className="bds-mono">18:30</span></>} />
      </div>

      <Panel>
        <CardHead title="진행 중인 롤아웃" meta="2.15.0-rc1" metaMono />
        <Stepper aria-label="롤아웃 단계" steps={steps} />
        <ProgressBar value={0.62} label="배치 진행" detail="24 / 38 노드 · 배치 3/6에서 멈춤" tone="warn" showValue />
        <Divider />
        <LogViewer aria-label="롤아웃 로그" lines={logs} numbers height={200} />
        <div className="kit-bottom">
          <InlineMessage tone="warn" icon="warning">멈춘 지점을 고치지 않고 재개하면 같은 단계에서 다시 멈춥니다.</InlineMessage>
          <div className="kit-actions">
            <Button variant="secondary" icon={paused ? "play" : "pause"} onClick={() => { setPaused((p) => !p); toast({ message: paused ? "롤아웃을 재개했습니다." : "롤아웃을 멈췄습니다.", tone: "info" }); }}>{paused ? "재개" : "일시정지"}</Button>
            <Button variant="primary" icon="skip-forward" onClick={() => toast({ message: "실패한 노드를 건너뛰고 다음 배치를 시작했습니다.", tone: "ok" })}>건너뛰고 진행</Button>
          </div>
        </div>
      </Panel>

      <Grid cols={2}>
        <Panel>
          <CardHead title="다음 릴리스" meta="현재 2.14.0" metaMono />
          <Stack gap={3}>
            <Field label="릴리스" hint="후보(rc)는 카나리 2대에만 먼저 나갑니다.">
              <Combobox aria-label="릴리스 선택" options={releases} value={release} onChange={(v) => setRelease(v ?? "2.14.0")} clearable placeholder="버전을 검색합니다" emptyText="그런 버전이 없습니다" />
            </Field>
            <DiffView aria-label="설정 변경" from="2.14.0" to={release} changes={diff} />
          </Stack>
        </Panel>
        <Panel>
          <CardHead title="롤아웃 설정" meta="edge.manifest.json" metaMono />
          <Stack gap={3}>
            <CodeEditor aria-label="롤아웃 매니페스트" language="json" value={config} rows={12} onChange={setConfig} onValidChange={(p) => setValid(p !== null)} />
            {!valid && <InlineMessage tone="crit" icon="warning">JSON이 아직 유효하지 않습니다. 저장은 유효할 때만 됩니다.</InlineMessage>}
            <Inline>
              <Spacer />
              <Button variant="primary" disabled={!valid} onClick={() => toast({ message: "매니페스트를 저장했습니다.", tone: "ok" })}>저장</Button>
            </Inline>
          </Stack>
        </Panel>
      </Grid>

      <Panel>
        <CardHead title="아티팩트 업로드" meta="청크 8 MiB" />
        <FileUpload items={uploads} multiple accept=".zip,.tar.zst,.sym" title="아티팩트를 끌어다 놓습니다" hint="저장소에 올린 뒤 서명을 대조합니다"
          onFiles={(files) => setUploads((u) => [...u, ...files.map((f, i) => ({ id: `n${u.length + i}`, name: f.name, size: f.size, status: "queued" }))])}
          onPause={(id) => patch(id, { status: "paused" })} onResume={(id) => patch(id, { status: "uploading" })}
          onRetry={(id) => patch(id, { status: "uploading", progress: 0, error: undefined })} onCancel={(id) => setUploads((u) => u.filter((f) => f.id !== id))} />
      </Panel>

      <Grid cols={2}>
        <Panel>
          <CardHead title="배포 이력" meta={`${HISTORY.length}건`} />
          <DataTable aria-label="배포 이력" rowKey={(r) => r.id} rows={HISTORY} columns={[
            { key: "version", header: "버전", render: (r) => <span className="bds-mono">{r.version}</span> },
            { key: "when", header: "시각", hideBelow: "tablet", render: (r) => <span className="bds-mono">{r.when}</span> },
            { key: "batches", header: "배치", align: "num" },
            { key: "nodes", header: "노드", align: "num" },
            { key: "result", header: "결과", render: (r) => <StatusPill size="sm" tone={r.tone}>{r.result}</StatusPill> },
            { key: "menu", header: "", width: 44, render: (r) => <DropdownMenu aria-label={`${r.version} 배포 동작`} align="end" items={[{ label: "요약 보기", icon: "eye" }, { label: "로그 내려받기", icon: "download" }, "-", { label: "이 버전으로 되돌리기", icon: "arrow-counter-clockwise", danger: true, onSelect: () => setRollback(true) }]} /> },
          ]} />
        </Panel>
        <Panel>
          <CardHead title="수동 배포" meta="현장 점검용" />
          <Stack gap={3}>
            <p>콘솔에 접근할 수 없을 때는 노드에서 직접 같은 아티팩트를 내려받습니다.</p>
            <CodeBlock language="bash">{`bonggu-edge update --channel rc \\\n  --version 2.15.0-rc1 --verify-signature`}</CodeBlock>
            <Timeline dense aria-label="예정된 작업" items={[
              { time: "09-10 02:00", title: "남은 배치 자동 재개", detail: "점검 창 안에서만 움직입니다.", tone: "info", icon: "clock" },
              { time: "09-12 02:00", title: "이전 버전 회수", detail: "2.13.2 아티팩트를 저장소에서 지웁니다.", tone: "off", icon: "trash" },
            ]} />
          </Stack>
        </Panel>
      </Grid>

      <FormModal open={plan} onClose={() => setPlan(false)} title="배포 예약" description="예약한 시각에 점검 창이 열려 있어야 롤아웃이 시작됩니다." submitLabel="예약" size="md"
        onSubmit={(e) => { e.preventDefault(); setPlan(false); toast({ message: `${when} 배포를 예약했습니다.`, tone: "ok" }); }}>
        <Stack gap={3}>
          <Field label="릴리스" required><TextField defaultValue={release} mono readOnly /></Field>
          <Grid cols={2}>
            <Field label="시작일" required><DatePicker value={when} onChange={setWhen} min="2026-09-09" /></Field>
            <Field label="배치 크기" hint="한 번에 올릴 노드 수"><Select aria-label="배치 크기" defaultValue="6" options={[{ value: "2", label: "2대" }, { value: "6", label: "6대" }, { value: "12", label: "12대" }]} /></Field>
          </Grid>
          <Field label="변경 메모" hint="이력과 알림에 함께 남습니다."><TextArea rows={3} placeholder="무엇이 바뀌는지 한 문장" /></Field>
          <Checkbox defaultChecked>실패하면 즉시 멈추기</Checkbox>
        </Stack>
      </FormModal>

      <ConfirmDialog open={rollback} danger confirmLabel="되돌리기" title="직전 버전으로 되돌립니다"
        message="반영된 24대가 2.14.0으로 내려갑니다. 되돌리는 동안 매장 디스플레이는 약 40초간 검은 화면이 됩니다."
        onClose={() => setRollback(false)} onConfirm={() => { setRollback(false); toast({ message: "2.14.0으로 되돌리는 중입니다.", tone: "warn" }); }} />
    </PageStack>
  );
}
window.DeploysScreen = DeploysScreen;
})();
