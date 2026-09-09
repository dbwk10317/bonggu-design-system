(() => {
const { PageStack, PageHeader, Panel, StatusPill, Tag, Button, DataTable, FormModal, Field, TextField, TextArea, Select, EmptyState, DescriptionList, KeyValues, Chart, StatTile, Grid, AlertBanner, LogViewer, ToastProvider, Modal, Drawer, CodeEditor, DropdownMenu, Stepper, FileUpload, DiffView, Timeline } = window.DS;
const useToast = ToastProvider.useToast;
const { training: TR, fmt } = window.KIT;

/* 제품 Training.tsx 조립 순서: PageHeader(3 액션) → 계약 안내 배너 → 등록 작업 → StatTile 5 → 등록된 프로젝트 → 품질 추세 | Revision diff → 학습 실행 → 모달들 */
const STATE = { running: ["실행 중", "ok"], queued: ["GPU 대기", "warn"], validating: ["검증 중", "info"], completed: ["완료", "ok"], failed: ["실패", "crit"], cancelled: ["취소됨", "off"] };
const REV = { available: ["사용 가능", "ok"], awaiting_approval: ["승인 대기", "warn"], deprecated: ["사용 중단", "off"] };

function TrainingScreen() {
  const { toast } = useToast();
  const [runOpen, setRunOpen] = React.useState(false);
  const [datasetOpen, setDatasetOpen] = React.useState(false);
  const [regOpen, setRegOpen] = React.useState(false);
  const [detail, setDetail] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [diff, setDiff] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const runs = TR.runs, active = runs.filter((r) => ["running", "queued", "validating"].includes(r.status)), queued = runs.filter((r) => r.status === "queued"), completed = runs.filter((r) => r.status === "completed");
  const submit = (msg) => { setBusy(true); setTimeout(() => { setBusy(false); setRunOpen(false); setDatasetOpen(false); setRegOpen(false); toast({ message: msg, tone: "ok" }); }, 700); };
  const pillOf = (map, k) => <StatusPill size="sm" tone={map[k]?.[1] ?? "off"}>{map[k]?.[0] ?? k}</StatusPill>;
  return (
    <>
      <PageStack aria-label="학습 프로젝트">
        <PageHeader title="학습 프로젝트" description="승인된 project revision과 호환 Dataset을 선택해 학습 실행을 관리합니다." actions={<><Button variant="secondary" onClick={() => setDatasetOpen(true)}>Dataset 등록</Button><Button variant="secondary" icon="play" onClick={() => setRunOpen(true)}>학습 실행</Button><Button variant="primary" icon="upload-simple" onClick={() => setRegOpen(true)}>프로젝트 등록</Button></>} />
        <AlertBanner tone="info" title="계약 기반 실행">ZIP 등록·revision 승인·Dataset 검증이 끝난 뒤에만 실행할 수 있습니다. image, command, mount, secret과 GPU ordinal은 화면에서 입력하지 않습니다.</AlertBanner>
        <Panel caption="프로젝트 등록 작업" padding="sm">
          <Panel padding="sm" sunken>
            <div className="kit-row"><Chart kind="radial" fit="fixed" width={96} height={72} aria-label="ocr-finetune.zip 등록 진행률" value={0.44} label="4/9 단계" tone="ok" valueFormatter={() => "44%"} />
              <div className="kit-grow"><span className="kit-inline"><b style={{ fontWeight: 500 }}>ocr-finetune.zip</b><StatusPill size="sm" tone="info">계약 검증</StatusPill></span><p className="kit-dim">PROJECT REGISTRATION · <span className="bds-mono">reg_7c1a · 184 MiB · 18:39:12</span></p><p className="kit-dim">mlproject.yaml 파싱 완료 · lockfile 해시 대조 중</p></div>
              <div className="kit-actions"><Button size="sm" variant="ghost">이력</Button><Button size="sm" variant="danger" onClick={() => setConfirm({ title: "프로젝트 등록을 취소할까요?", description: "서버 등록 상태는 취소 후 정리됩니다.", label: "등록 취소" })}>등록 취소</Button></div></div>
          </Panel>
        </Panel>
        <div className="bds-metric-grid">
          <StatTile icon="play-circle" label="진행 중" value={active.length} unit="건" pill={{ tone: "ok", text: "실행" }} detail={<>{active.map((r) => <Tag key={r.id}>{r.id}</Tag>)}</>} />
          <StatTile icon="hourglass" label="GPU 대기" value={queued.length} unit="건" detail={<>필요 VRAM <span className="bds-mono">6.0 GiB</span> · 발급 가능 <span className="bds-mono">6.00 GiB</span></>} />
          <StatTile icon="check-circle" label="성공" value={completed.length} unit="건" delta={2} deltaLabel="이번 주" detail={<>실패 {runs.filter((r) => r.status === "failed").length} · 취소 {runs.filter((r) => r.status === "cancelled").length}</>} />
          <StatTile icon="folder" label="프로젝트" value={TR.projects.length} unit="개" detail={<>승인 대기 {TR.projects.filter((p) => p.rev.status === "awaiting_approval").length}</>} />
          <StatTile icon="gauge" label="내 quota" value="1/1" detail={<>GPU 시간 잔여 <span className="bds-mono">312분</span> · 갱신 <span className="bds-mono">1일</span></>} />
        </div>
        <Panel caption="등록된 프로젝트" padding="sm">
          <DataTable aria-label="학습 프로젝트와 revision 목록" rows={TR.projects} rowKey={(p) => p.id} rowLabel={(p) => p.name}
            empty={<EmptyState plain title="등록된 학습 프로젝트가 없습니다" description="프로젝트 등록으로 첫 ZIP bundle이 추가됩니다." />}
            columns={[
              { key: "name", header: "프로젝트", render: (p) => <span className="kit-cell2"><b style={{ fontWeight: 500 }}>{p.name}</b><span className="kit-dim bds-mono">{p.id} · {p.owner}</span></span> },
              { key: "rev", header: "revision", hideBelow: "tablet", render: (p) => <span className="bds-mono">{p.rev.version} · {p.rev.id}</span> },
              { key: "status", header: "상태", render: (p) => pillOf(REV, p.rev.status) },
              { key: "updated", header: "업데이트", align: "num", hideBelow: "desktop", render: (p) => <span className="bds-mono">{p.updated}</span> },
              { key: "act", header: "", render: (p) => <span className="kit-actions"><Button size="sm" variant="primary" disabled={p.rev.status !== "available"} onClick={() => setRunOpen(true)}>학습 실행</Button>{p.rev.status === "awaiting_approval" && <Button size="sm" variant="secondary" onClick={() => toast({ message: "project revision을 승인했습니다.", tone: "ok" })}>승인</Button>}{p.prev && <Button size="sm" variant="ghost" onClick={() => setDiff(p)}>revision 비교</Button>}</span> },
            ]}
            expandable={(p) => <DescriptionList items={[{ term: "식별자", detail: p.id, mono: true }, { term: "소유자", detail: p.owner, mono: true }, { term: "최신 revision", detail: `${p.rev.version} · ${p.rev.id}`, mono: true }, { term: "recipes", detail: p.recipes.join(" · "), mono: true }, { term: "dataset format", detail: p.format, mono: true }]} />} />
        </Panel>
        <Grid cols={2}>
          <Panel caption="품질 추세">
            <p className="kit-dim">프로젝트별 primary metric을 서버 snapshot으로 표시합니다.</p>
            <Grid min={180}>{TR.trend.series.map((s) => <div key={s.label} className="kit-cell2" style={{ justifyItems: "stretch" }}><span className="kit-dim">{s.label}</span><Chart kind="line" aria-label={`${s.label} 추세`} height={120} labels={TR.trend.labels} series={[s]} showLegend={false} xTicks="ends" valueFormatter={(v) => v.toFixed(3)} /></div>)}</Grid>
          </Panel>
          <Panel caption="Revision diff">
            {diff ? <DiffView from={diff.prev.id} to={diff.rev.id} changes={diff.changed.map(([field, v]) => { const [from, to] = String(v).includes(" → ") ? String(v).split(" → ") : String(v).startsWith("+ ") ? [null, String(v).slice(2)] : [null, String(v)]; return { field, from, to }; })} />
              : <EmptyState plain title="비교 결과가 없습니다" description="프로젝트 목록에서 revision 비교를 선택하면 표시됩니다." />}
          </Panel>
        </Grid>
        <Panel caption="학습 실행" padding="sm">
          <DataTable aria-label="학습 실행 운영 목록" rows={runs} rowKey={(r) => r.id} rowLabel={(r) => r.id}
            columns={[
              { key: "id", header: "실행", render: (r) => <span className="kit-cell2"><b style={{ fontWeight: 500 }} className="bds-mono">{r.id}</b><span className="kit-dim">{r.project} · {r.recipe}</span></span> },
              { key: "status", header: "상태", render: (r) => <span className="kit-cell2">{pillOf(STATE, r.status)}<span className="kit-dim">{r.detail}</span></span> },
              { key: "stage", header: "현재 단계", hideBelow: "tablet", render: (r) => r.stage ? <span>{r.stage} · <span className="kit-dim">{r.stageStatus}</span></span> : <span className="kit-dim">Prefect orchestration</span> },
              { key: "res", header: "리소스", hideBelow: "desktop", render: (r) => <span className="bds-mono">{r.priority}{r.vram ? ` · ${fmt.gib(r.vram)}` : ""}</span> },
              { key: "updated", header: "업데이트", align: "num", hideBelow: "desktop", render: (r) => <span className="bds-mono">{r.updated}</span> },
              { key: "act", header: "", render: (r) => <span className="kit-actions"><Button size="sm" variant="secondary" onClick={() => setDetail(r)}>상세</Button><DropdownMenu aria-label={`${r.id} 더 보기`} items={[
                ...(["running", "queued", "validating"].includes(r.status) ? [{ label: "학습 중지", icon: "stop", danger: true, onSelect: () => setConfirm({ title: `${r.id} 학습 작업을 중지할까요?`, description: "진행 중인 stage를 중단하고 GPU 예약을 반환합니다.", label: "학습 중지" }) }] : []),
                ...(["failed", "cancelled"].includes(r.status) ? [{ label: "같은 입력으로 재실행", icon: "arrow-counter-clockwise", onSelect: () => setConfirm({ title: "같은 입력으로 학습을 다시 실행할까요?", description: "같은 project revision·Dataset·config로 재실행을 생성합니다.", label: "재실행" }) }] : []),
                { label: "로그 보기", icon: "scroll", onSelect: () => setDetail(r) }, { label: "run id 복사", icon: "copy", onSelect: () => toast({ message: "run id를 복사했습니다.", tone: "ok" }) }]} /></span> },
            ]}
            expandable={(r) => <DescriptionList items={[{ term: "project revision", detail: r.revision, mono: true }, { term: "dataset revision", detail: r.dataset, mono: true }, { term: "우선순위", detail: r.priority }, { term: "결과", detail: r.result }]} />} />
        </Panel>
      </PageStack>
      <FormModal open={runOpen} onClose={() => setRunOpen(false)} onSubmit={() => submit("학습 실행을 생성했습니다. Prefect와 GPU admission 상태를 확인합니다.")} busy={busy} title="학습 실행 생성" description="승인된 project revision과 호환 Dataset만 선택할 수 있습니다. 실행 이미지는 revision 계약이 관리합니다." submitLabel="실행 생성">
        <Field label="project revision" hint="source 9f2c1e7a4b8d · image digest 고정"><Select defaultValue="rev_0913" options={TR.projects.filter((p) => p.rev.status === "available").map((p) => ({ value: p.rev.id, label: `${p.name} · ${p.rev.version}` }))} /></Field>
        <Field label="dataset revision" hint="validator·schema·split closure가 project revision과 일치해야 합니다."><Select defaultValue="ds_0902" options={TR.datasets.map((d) => ({ value: d.id, label: `${d.name} · ${d.id}` }))} /></Field>
        <Field label="recipe"><Select defaultValue="finetune" options={[{ value: "finetune", label: "finetune" }, { value: "eval", label: "eval" }]} /></Field>
        <Field label="우선순위"><Select defaultValue="standard" options={["interactive", "standard", "bulk"].map((v) => ({ value: v, label: v }))} /></Field>
        <Field label="config JSON" hint="허용 필드: epochs, lr, batch_size, seed"><CodeEditor defaultValue={'{\n  "epochs": 20,\n  "lr": 2e-5,\n  "batch_size": 16\n}'} rows={5} /></Field>
      </FormModal>
      <FormModal open={datasetOpen} onClose={() => setDatasetOpen(false)} onSubmit={() => submit("Dataset 업로드를 완료했습니다. validator 검증 후 목록에 표시됩니다.")} busy={busy} title="Dataset 등록" description="승인된 project revision의 validator로 ZIP 내용을 검증한 뒤 immutable Dataset revision을 발행합니다." submitLabel="업로드 및 검증">
        <Field label="validator project revision" required><Select defaultValue="rev_0913" options={TR.projects.filter((p) => p.rev.status === "available").map((p) => ({ value: p.rev.id, label: `${p.name} · ${p.rev.version}` }))} /></Field>
        <Field label="Dataset 이름" required><TextField placeholder="예: dataset-2026-09" maxLength={120} /></Field>
        <Field label="Dataset format"><TextField readOnly mono value="jsonl/v1" onChange={() => {}} /></Field>
        <Field label="Dataset ZIP" hint="압축 해제 경로와 크기, schema, split closure를 서버에서 검증합니다."><Button variant="secondary" icon="file-zip">ZIP 파일 선택</Button></Field>
      </FormModal>
      <Modal open={regOpen} onClose={() => setRegOpen(false)} title="학습 프로젝트 등록" description="검증된 mlproject.yaml과 lockfile이 포함된 ZIP만 등록합니다. 코드는 Hub API나 host 경로를 직접 지정할 수 없습니다." actions={<><Button variant="ghost" onClick={() => setRegOpen(false)}>취소</Button><Button variant="primary" onClick={() => submit("프로젝트 등록을 시작했습니다.")}>프로젝트 등록 시작</Button></>}>
        <FileUpload accept=".zip" multiple={false} onFiles={() => {}} onPause={() => {}} onResume={() => {}} onCancel={() => {}} title="프로젝트 ZIP을 끌어다 놓거나 클릭" hint="mlproject.yaml + lockfile 포함 · 페이지를 닫아도 서버 등록 상태는 보존됩니다" items={[{ id: "u1", name: "ocr-finetune.zip", size: 193e6, status: "uploading", progress: 0.44, chunk: 4, chunks: 9, rate: "42 MiB/s" }]} />
        <AlertBanner tone="info" title="안전한 등록">Dockerfile·raw secret·host mount·직접 GPU 선언은 자동으로 거부됩니다.</AlertBanner>
      </Modal>
      <Drawer open={!!detail} onClose={() => setDetail(null)} size="lg" title="학습 실행 상세" description={detail ? `${detail.id} · ${detail.updated}` : ""} actions={<><Button variant="ghost" onClick={() => setDetail(null)}>닫기</Button>{detail && ["running", "queued", "validating"].includes(detail.status) && <Button variant="danger" onClick={() => { setDetail(null); setConfirm({ title: `${detail.id} 학습 작업을 중지할까요?`, description: "진행 중인 stage를 중단하고 GPU 예약을 반환합니다.", label: "학습 중지" }); }}>학습 중지</Button>}</>}>
        {detail && (<>
          <Panel caption="실행 정보" padding="sm"><DescriptionList items={[{ term: "상태", detail: pillOf(STATE, detail.status) }, { term: "프로젝트 revision", detail: detail.revision, mono: true }, { term: "데이터셋 revision", detail: detail.dataset, mono: true }, { term: "recipe", detail: detail.recipe }, { term: "우선순위", detail: detail.priority }, { term: "결과", detail: detail.result }]} /></Panel>
          <Panel caption="Stage" padding="sm"><Stepper orientation="vertical" steps={TR.stages.map((s) => ({ label: s.name, status: s.status === "completed" ? "done" : s.status === "running" ? "current" : s.status === "failed" ? "error" : "todo", detail: <>{s.profile} · <span className="bds-mono">{fmt.gib(s.vram)}</span></> }))} /></Panel>
          <Panel caption="메트릭" padding="sm"><Chart kind="line" aria-label="loss 추이" height={150} labels={TR.loss.map((_, i) => `ep ${i + 1}`)} series={[{ label: "train loss", tone: 3, values: TR.loss }, { label: "val loss", tone: 2, values: TR.loss.map((v) => v + 0.08) }]} valueFormatter={(v) => v.toFixed(2)} /></Panel>
          <Panel caption="로그" padding="sm"><LogViewer height={160} lines={TR.logs} /></Panel>
        </>)}
      </Drawer>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} size="sm" title={confirm?.title ?? ""} description={confirm?.description} actions={<><Button variant="ghost" onClick={() => setConfirm(null)}>취소</Button><Button variant="danger" onClick={() => { toast({ message: `${confirm.label} 요청을 보냈습니다.` }); setConfirm(null); }}>{confirm?.label}</Button></>} />
    </>
  );
}
window.TrainingScreen = TrainingScreen;
})();
