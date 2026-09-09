(() => {
const { PageStack, PageHeader, Panel, StatusPill, Button, DataTable, FormModal, Field, TextField, TextArea, Select, Checkbox, EmptyState, DescriptionList, AlertBanner, Grid, ToastProvider, Modal, CopyField } = window.DS;
const useToast = ToastProvider.useToast;
const { tokens: TOKENS, tokenScopes: SCOPES } = window.KIT;

/* 제품 Settings.tsx의 패널 순서·문구를 따른다: 화면 갱신 → Lease 기본값 → 개인 화면 설정 → 고급 운영 한도 → 학습 정책 → 허브 시스템 정보 → 자동화 토큰 */
function SettingsScreen() {
  const { toast } = useToast();
  const [dirty, setDirty] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [tokenOpen, setTokenOpen] = React.useState(false);
  const [issued, setIssued] = React.useState(null);
  const [revoke, setRevoke] = React.useState(null);
  const [theme, setTheme] = React.useState(() => document.documentElement.classList.contains("dark") ? "dark" : "light");
  const touch = () => { setDirty(true); setSaved(false); };
  const save = () => { setBusy(true); setTimeout(() => { setBusy(false); setDirty(false); setSaved(true); toast({ message: "허브 설정을 저장했습니다.", tone: "ok" }); }, 600); };
  const applyTheme = (v) => { setTheme(v); const dark = v === "dark" || (v === "system" && matchMedia("(prefers-color-scheme: dark)").matches); document.documentElement.classList.toggle("dark", dark); document.documentElement.dataset.theme = dark ? "dark" : "light"; };
  const status = (t) => t.revoked ? { label: "폐기됨", tone: "off" } : t.expired ? { label: "만료됨", tone: "off" } : { label: "사용 중", tone: "ok" };
  const actions = <><Button variant="ghost" disabled={!dirty || busy} onClick={() => { setDirty(false); toast({ message: "저장하지 않은 설정 변경사항을 취소했습니다." }); }}>변경 취소</Button><Button variant="primary" busy={busy} disabled={!dirty} onClick={save}>설정 저장</Button></>;
  return (
    <>
      <PageStack aria-label="설정">
        <PageHeader title="허브 설정" description="화면 갱신, Lease 기본값, 자동화 토큰과 허브 정보를 관리합니다." actions={actions} />
        {saved && <AlertBanner tone="info" title="설정 저장" dismissible onDismiss={() => setSaved(false)}>설정을 저장했습니다. 다른 클라이언트에는 다음 갱신 주기에 반영됩니다.</AlertBanner>}
        <Grid cols={2}>
          <Panel caption="화면 갱신">
            <Field label="현황·모델 상태 갱신" hint="현황과 모델 목록, 적재 상태를 함께 갱신하는 간격입니다."><Select defaultValue="2" onChange={touch} options={["2", "5", "10", "30", "60"].map((v) => ({ value: v, label: `${v}초` }))} /></Field>
            <Field label="GPU 센서 갱신" hint="Prometheus의 1초 NVIDIA 시계열을 화면에 반영하는 간격입니다."><Select defaultValue="1" onChange={touch} options={["1", "2", "5"].map((v) => ({ value: v, label: `${v}초` }))} /></Field>
            <Field label="요청 그래프 갱신" hint="모델별 요청량, 오류와 응답시간 그래프를 갱신하는 간격입니다."><Select defaultValue="2" onChange={touch} options={["2", "5", "10", "30", "60"].map((v) => ({ value: v, label: `${v}초` }))} /></Field>
          </Panel>
          <Panel caption="Lease 기본값">
            <Field label="기본 Lease 유효시간" hint="모델을 활성화하거나 자동 검증할 때 요청하는 GPU 예약 유효시간입니다."><Select defaultValue="900" onChange={touch} options={[{ value: "300", label: "5분" }, { value: "900", label: "15분" }, { value: "3600", label: "1시간" }, { value: "14400", label: "4시간" }]} /></Field>
            <p className="kit-dim">유효시간이 지나면 heartbeat가 없는 예약은 자동으로 회수되어 VRAM이 반환됩니다.</p>
          </Panel>
          <Panel caption="개인 화면 설정">
            <Field label="화면 테마" hint="이 브라우저에만 저장되며 시스템 테마 변경도 자동으로 따라갈 수 있습니다."><Select value={theme} onChange={(e) => applyTheme(e.target.value)} options={[{ value: "system", label: "시스템 설정" }, { value: "light", label: "라이트" }, { value: "dark", label: "다크" }]} /></Field>
            <Field label="시간 표시" hint="표와 활동 기록의 시각 표시에 적용됩니다."><Select defaultValue="24h" options={[{ value: "24h", label: "24시간제" }, { value: "12h", label: "12시간제" }]} /></Field>
            <Field label="GPU 용량 단위" hint="현황, 모델, Lease와 학습 화면의 GPU 용량 표시에 적용됩니다."><Select defaultValue="GiB" options={[{ value: "GiB", label: "GiB" }, { value: "MiB", label: "MiB" }]} /></Field>
            <p className="kit-dim">개인 화면 설정은 변경 즉시 적용되며 서버 설정 저장 대상에 포함되지 않습니다.</p>
          </Panel>
          <Panel caption="허브 시스템 정보">
            <DescriptionList items={[{ term: "API 연결", detail: <StatusPill size="sm" tone="ok">연결됨</StatusPill> }, { term: "운영 방식", detail: "통합 Admission + Agent" }, { term: "프로세스 자동 제어", detail: "사용 중" }, { term: "인증 주체", detail: "yeonho@bonggu.me", mono: true }, { term: "버전", detail: "v0.6", mono: true }]} />
            <p className="kit-dim">보안을 위해 API 키, 서비스 토큰, Docker 제어 권한은 이 화면에 노출하거나 저장하지 않습니다.</p>
          </Panel>
          <Panel caption={<><span>고급 운영 한도</span><StatusPill size="sm" tone="off">배포 환경에서 관리</StatusPill></>}>
            <DescriptionList items={[{ term: "VRAM 안전 여유", detail: "2.00 GiB", mono: true }, { term: "LocalAI VRAM 예산", detail: "16 GiB", mono: true }, { term: "최대 활성 백엔드", detail: "3", mono: true }, { term: "유휴 자동 종료", detail: "15m", mono: true }]} />
            <p className="kit-dim">이 값은 배포 환경과 프로세스 재시작 정책에 연결되어 있어 이 화면에서는 읽기 전용입니다.</p>
          </Panel>
          <Panel caption={<><span>학습 정책</span><StatusPill size="sm" tone="off">배포 환경에서 관리</StatusPill></>}>
            <DescriptionList items={[{ term: "사용자별 동시 단계", detail: "1", mono: true }, { term: "사용자별 대기 단계", detail: "3", mono: true }, { term: "GPU 시간 할당량", detail: "8시간", mono: true }, { term: "할당량 갱신 주기", detail: "1일", mono: true }, { term: "대기열 기아 방지", detail: "30분", mono: true }]} />
            <p className="kit-dim">학습 자원 정책은 모든 사용자에게 공통 적용되며 배포 설정에서 변경합니다.</p>
          </Panel>
        </Grid>
        <Panel caption="자동화 토큰" padding="sm" className="kit-tablepanel">
          <div className="kit-panelbar"><p className="kit-dim">agent와 응용 서비스에는 필요한 scope만 발급합니다. 원문은 발급 모달에서 한 번만 표시됩니다.</p><Button icon="key" onClick={() => { setIssued(null); setTokenOpen(true); }}>토큰 발급</Button></div>
          <DataTable aria-label="자동화 토큰 목록" rows={TOKENS} rowKey={(t) => t.id} rowLabel={(t) => t.label}
            empty={<EmptyState plain title="발급된 scoped token이 없습니다" />}
            columns={[
              { key: "label", header: "토큰", render: (t) => <span className="kit-cell2"><b style={{ fontWeight: 500 }}>{t.label}</b><span className="kit-dim bds-mono">{t.prefix}…</span></span> },
              { key: "scopes", header: "scope", hideBelow: "desktop", render: (t) => <span className="bds-mono kit-dim">{t.scopes.join(" · ")}</span> },
              { key: "expires", header: "만료 시각", hideBelow: "tablet", align: "num", render: (t) => <span className="bds-mono">{t.expires ?? "만료 없음"}</span> },
              { key: "last", header: "마지막 사용", hideBelow: "tablet", align: "num", render: (t) => <span className="bds-mono">{t.last ?? "사용 기록 없음"}</span> },
              { key: "state", header: "상태", render: (t) => <StatusPill size="sm" tone={status(t).tone}>{status(t).label}</StatusPill> },
              { key: "act", header: "", render: (t) => t.revoked ? null : <Button size="sm" variant="ghost" onClick={() => setRevoke(t)}>폐기</Button> },
            ]}
            expandable={(t) => <DescriptionList items={[{ term: "식별자", detail: `${t.prefix}…`, mono: true }, { term: "권한 scope", detail: t.scopes.join(" · "), mono: true }, { term: "발급 시각", detail: t.created, mono: true }, { term: "만료 시각", detail: t.expires ?? "만료 없음", mono: true }, { term: "마지막 사용", detail: t.last ?? "사용 기록 없음", mono: true }]} />} />
        </Panel>
        <div className="kit-endactions">{actions}</div>
      </PageStack>
      <FormModal open={tokenOpen} onClose={() => setTokenOpen(false)} onSubmit={() => setIssued("bgt_9f2c1e7a4b8d3f60a1c5e2b7d4f8a9c0e3b6d1f2a5c8e7b4d0f3a6c9e2b5d8f1")} title="자동화 토큰 발급" submitLabel={issued ? null : "토큰 발급"} description={issued ? undefined : "필요한 권한을 하나 이상 선택해야 발급됩니다."}>
        {issued ? (
          <Panel caption="발급된 토큰" sunken>
            <p><b style={{ fontWeight: 500 }}>지금 복사해 두어야 합니다. 다시 표시되지 않습니다.</b></p>
            <CopyField secret value={issued} onCopy={(ok) => toast({ message: ok ? "토큰을 클립보드에 복사했습니다." : "자동 복사가 차단되었습니다. 토큰을 직접 선택해 복사해야 합니다.", tone: ok ? "ok" : "warn" })} />
          </Panel>
        ) : (
          <>
            <Field label="용도 이름" required><TextField autoFocus placeholder="예: bonggu-host-agent" maxLength={120} /></Field>
            <Field label="유효 기간" hint="기존 토큰과 만료 없음 토큰은 직접 폐기할 때까지 사용할 수 있습니다."><Select defaultValue="" options={[{ value: "", label: "만료 없음" }, { value: "86400", label: "1일" }, { value: "604800", label: "7일" }, { value: "2592000", label: "30일" }]} /></Field>
            <div className="bds-field"><span className="bds-field__label">허용 scope</span><div className="kit-checks">{SCOPES.map((s) => <Checkbox key={s}><span className="bds-mono">{s}</span></Checkbox>)}</div></div>
          </>
        )}
      </FormModal>
      <Modal open={!!revoke} onClose={() => setRevoke(null)} size="sm" title="자동화 토큰 폐기" description={`‘${revoke?.label}’ 토큰을 폐기하면 이 토큰을 사용하는 agent와 서비스가 즉시 인증하지 못합니다.`} actions={<><Button variant="ghost" onClick={() => setRevoke(null)}>취소</Button><Button variant="danger" onClick={() => { setRevoke(null); toast({ message: "토큰을 폐기했습니다." }); }}>토큰 폐기</Button></>} />
    </>
  );
}
window.SettingsScreen = SettingsScreen;
})();
