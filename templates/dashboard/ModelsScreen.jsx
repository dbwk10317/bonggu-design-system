(() => {
const { PageStack, PageHeader, Panel, StatusPill, Tag, Toolbar, ToolbarGrow, SegmentedControl, Select, Button, DataTable, FormModal, Field, TextField, EmptyState, DescriptionList, KeyValues, Chart, StatTile, Grid, ToastProvider, Modal, Icon, DropdownMenu, Combobox, CopyField, Stepper } = window.DS;
const useToast = ToastProvider.useToast;
const { models: MODELS, hub: H, ticks, fmt } = window.KIT;

/* 제품 hubModels.ts monitorState()의 라벨·톤 매핑을 그대로 옮긴 표시 규칙 */
const RUNTIME = { localai: "LocalAI", "custom-worker": "ONNX" };

function ModelsScreen() {
  const { toast } = useToast();
  const [filter, setFilter] = React.useState("all");
  const [graph, setGraph] = React.useState("");
  const [edit, setEdit] = React.useState(null);
  const [unload, setUnload] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const rows = MODELS.filter((m) => filter === "all" ? true : filter === "active" ? m.active : m.runtime === filter);
  const active = MODELS.filter((m) => m.active);
  const reserved = active.reduce((a, m) => a + m.vram_mib, 0);
  const save = () => { setBusy(true); setTimeout(() => { setBusy(false); setEdit(null); toast({ message: edit === "new" ? "등록 작업을 큐에 넣었습니다." : "모델 설정을 저장했습니다.", tone: "ok" }); }, 700); };
  const sel = MODELS.find((m) => m.id === graph);
  const req = sel ? H.requests.map((v) => Math.round(v * sel.share)) : H.requests;
  const err = sel ? H.errors.map((v) => Math.round(v * sel.share)) : H.errors;
  return (
    <>
      <PageStack aria-label="모델 관리">
        <PageHeader title="모델 관리" description="실행 방식과 관계없이 같은 VRAM admission으로 모델을 활성화하거나 비활성화합니다." actions={<><Button variant="secondary" icon="storefront">알려진 모델 설치</Button><Button variant="primary" icon="plus" onClick={() => setEdit("new")}>ONNX 모델 등록</Button></>} />
        <div className="bds-metric-grid">
          <StatTile icon="stack" label="전체 모델" value={MODELS.length} unit="개" detail={<>LocalAI {MODELS.filter((m) => m.runtime === "localai").length} · ONNX {MODELS.filter((m) => m.runtime === "custom-worker").length}</>} />
          <StatTile icon="cube" label="활성 모델" value={active.length} unit="개" pill={{ tone: "ok", text: "실행 중" }} detail={<>{active.map((m) => <Tag key={m.id}>{m.name}</Tag>)}</>} />
          <StatTile icon="hourglass" label="대기 중" value={MODELS.filter((m) => m.state === "queued").length} unit="건" pill={{ tone: "warn", text: "GPU 대기" }} detail={<>ko-rerank · 필요 VRAM <span className="bds-mono">3.2 GiB</span></>} />
          <StatTile icon="memory" label="예약 VRAM" value={reserved / 1024} digits={1} unit="GiB" detail={<>발급 가능 <span className="bds-mono">{fmt.gib(H.capacity.available)}</span> · 안전 여유 <span className="bds-mono">{fmt.gib(H.capacity.headroom)}</span></>} />
        </div>
        <Panel caption="모델 등록 작업" padding="sm">
          <Grid min={260}>
            <Panel padding="sm" sunken>
              <div className="kit-row"><Chart kind="radial" fit="fixed" width={96} height={72} aria-label="ko-rerank 등록 진행률" value={0.64} label="검증 중" tone="ok" valueFormatter={() => "64%"} />
                <div className="kit-grow"><b style={{ fontWeight: 500 }}>ko-rerank</b><p className="kit-dim">ONNX REGISTRATION · GPU 검증과 smoke 추론 · VRAM 측정 대기</p><Stepper size="sm" aria-label="등록 단계" current={4} steps={[{ label: "업로드" }, { label: "해시 검증" }, { label: "계약 파싱" }, { label: "GPU 검증" }, { label: "smoke 추론", detail: "2분 14초" }, { label: "VRAM 측정" }]} /></div>
                <div className="kit-actions"><Button size="sm" variant="ghost">이벤트</Button><Button size="sm" variant="danger">취소</Button></div></div>
            </Panel>
          </Grid>
        </Panel>
        <Grid cols={2}>
          <Panel caption="모델별 VRAM">
            <Chart kind="pie" aria-label="모델별 VRAM 예약 비율" height={200} caption="GiB 예약" valueFormatter={(v) => (v / 1024).toFixed(1)}
              segments={active.map((m, i) => ({ label: m.name, value: m.vram_mib, tone: i + 1 }))} />
            <KeyValues rows={[["발급 가능", <span className="bds-mono">{fmt.gib(H.capacity.available)}</span>], ["실제 사용", <span className="bds-mono">{fmt.gib(H.capacity.used)}</span>], ["VRAM 총량", <span className="bds-mono">{fmt.gib(H.capacity.total)}</span>]]} />
          </Panel>
          <Panel caption="그래픽카드">
            <div className="kit-gauges">
              <Chart kind="radial" fit="fixed" width={140} height={100} aria-label="GPU 코어 사용률" value={0.08} label="코어" tone="ok" valueFormatter={() => "8%"} />
              <Chart kind="radial" fit="fixed" width={140} height={100} aria-label="VRAM 사용률" value={H.capacity.used / H.capacity.total} label="VRAM" tone="ok" valueFormatter={(v) => `${Math.round(v * 100)}%`} />
            </div>
            <KeyValues rows={[["온도", <span className="bds-mono">41.0°C</span>], ["전력", <span className="bds-mono">68 W</span>], ["수집 원본", <span>Prometheus · <span className="bds-mono">1s</span></span>]]} />
          </Panel>
        </Grid>
        <Panel caption="요청과 응답 현황">
          <Toolbar end={<StatusPill size="sm" tone="info">최근 12시간</StatusPill>}>
            <Combobox fit="fixed" width={240} aria-label="그래프 모델" placeholder="전체 모델" value={graph || null} onChange={(v) => setGraph(v ?? "")} options={MODELS.map((m) => ({ value: m.id, label: m.name, detail: RUNTIME[m.runtime] }))} />
            <KeyValues rows={[["요청", <span className="bds-mono">{req.reduce((a, b) => a + b, 0).toLocaleString("ko-KR")}</span>], ["오류", <span className="bds-mono">{err.reduce((a, b) => a + b, 0)}</span>], ["p95 응답", <span className="bds-mono">{sel ? sel.p95 : "412"} ms</span>]]} />
          </Toolbar>
          <Chart kind="area" aria-label="선택한 모델의 최근 요청과 오류 추이" height={200} labels={ticks} series={[{ label: "요청", tone: 1, values: req }, { label: "오류", tone: "crit", values: err }]} />
        </Panel>
        <Panel caption="통합 모델 목록" padding="sm" className="kit-tablepanel">
          <Toolbar end={<span className="kit-dim bds-mono">{rows.length}개</span>}>
            <SegmentedControl aria-label="모델 필터" value={filter} onChange={setFilter} options={[{ value: "all", label: "전체" }, { value: "active", label: "활성" }, { value: "localai", label: "LocalAI" }, { value: "custom-worker", label: "ONNX" }]} />
          </Toolbar>
          <DataTable aria-label="통합 모델 실행 상태와 제어" rows={rows} rowKey={(m) => m.id} rowLabel={(m) => m.name}
            empty={<EmptyState plain title="조건에 맞는 모델이 없습니다" description="다른 필터를 선택해 보세요." />}
            columns={[
              { key: "name", header: "모델", render: (m) => <span className="kit-cell2"><b style={{ fontWeight: 500 }}>{m.name}</b><span className="kit-dim bds-mono">{m.id}</span></span> },
              { key: "runtime", header: "런타임", hideBelow: "tablet", render: (m) => <span className="bds-mono">{RUNTIME[m.runtime]}</span> },
              { key: "state", header: "실행 상태", render: (m) => <span className="kit-cell2"><StatusPill size="sm" tone={m.tone}>{m.label}</StatusPill><span className="kit-dim">{m.detail}</span></span> },
              { key: "usage", header: "용도", hideBelow: "desktop", render: (m) => <span className="kit-tags">{m.capabilities.map((c) => <Tag key={c}>{c}</Tag>)}</span> },
              { key: "policy", header: "정책", hideBelow: "desktop", render: (m) => m.pinned ? <Tag accent icon="push-pin">유지</Tag> : <span className="kit-dim">요청 시 로드</span> },
              { key: "vram", header: "예약 VRAM", align: "num", render: (m) => <span className="bds-mono">{m.active ? fmt.gib(m.vram_mib) : "—"}</span> },
              { key: "act", header: "", render: (m) => <span className="kit-actions">{m.active ? <Button size="sm" variant="secondary" onClick={() => setUnload(m)}>비활성화</Button> : <Button size="sm" variant="primary" disabled={m.state === "queued"} onClick={() => toast({ message: `${m.name} 활성화를 요청했습니다.`, tone: "info" })}>활성화</Button>}<DropdownMenu aria-label={`${m.name} 더 보기`} items={[{ label: "관리", icon: "gear-six", onSelect: () => setEdit(m) }, { label: "호출 예시 복사", icon: "copy", onSelect: () => toast({ message: "curl 예시를 복사했습니다.", tone: "ok" }) }, { label: "로그 보기", icon: "scroll", disabled: !m.active }, "-", { label: "목록에서 제거", icon: "trash", danger: true, onSelect: () => toast({ message: `${m.name}을 허브 목록에서 제거했습니다.` }) }]} /></span> },
            ]}
            expandable={(m) => <div className="kit-expand"><DescriptionList items={[{ term: "런타임", detail: RUNTIME[m.runtime] }, { term: "상태 상세", detail: m.detail }, { term: "필요 VRAM", detail: fmt.gib(m.vram_mib), mono: true }, { term: "설명", detail: m.description }]} /><CopyField label="식별자" value={m.id} /><CopyField label="호출 예시" multiline value={`curl -X POST https://ai.bonggu.me/v2/models/${m.id}/infer \\\n  -H "Authorization: Bearer $TOKEN" -d @input.json`} /></div>} />
        </Panel>
      </PageStack>
      <FormModal open={!!edit} onClose={() => setEdit(null)} onSubmit={save} busy={busy} title={edit === "new" ? "ONNX 모델 등록" : "모델 관리"} description={edit === "new" ? "업로드된 artifact는 GPU 검증·smoke 추론·VRAM 측정을 거쳐 활성화 가능 상태가 됩니다." : `${edit?.name} 의 실행 설정을 바꿉니다.`} submitLabel={edit === "new" ? "등록" : "저장"}>
        <Field label="모델 이름" required><TextField autoFocus defaultValue={edit?.name ?? ""} placeholder="예: ko-rerank" /></Field>
        <Field label="실행 방식" hint="관리형 Triton은 허브가 컨테이너를 직접 띄우고 종료합니다."><Select defaultValue="triton-onnx" options={[{ value: "triton-onnx", label: "관리형 Triton ONNX" }, { value: "custom-container", label: "Custom runtime" }]} /></Field>
        <Field label="간편 입력 API"><Select defaultValue="auto" options={[{ value: "auto", label: "안전한 자동 감지" }, { value: "tensor", label: "Raw tensor" }, { value: "image", label: "이미지" }, { value: "text", label: "텍스트" }]} /></Field>
        <Field label="연산자 profile" hint="contrib 연산자를 쓰는 모델만 ONNX Runtime contrib을 선택합니다."><Select defaultValue="standard" options={[{ value: "standard", label: "표준 ONNX" }, { value: "ort-contrib", label: "ONNX Runtime contrib" }]} /></Field>
      </FormModal>
      <Modal open={!!unload} onClose={() => setUnload(null)} size="sm" title="모델을 비활성화할까요?" description={`${unload?.name} 모델을 비활성화하고 VRAM 예약을 해제합니다. 실제 종료를 확인한 뒤 VRAM을 반환합니다.`} actions={<><Button variant="ghost" onClick={() => setUnload(null)}>취소</Button><Button variant="danger" onClick={() => { setUnload(null); toast({ message: `${unload.name} 비활성화를 요청했습니다.` }); }}>비활성화</Button></>} />
    </>
  );
}
window.ModelsScreen = ModelsScreen;
})();
