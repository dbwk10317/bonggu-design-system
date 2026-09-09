(() => {
const { PageStack, PageHeader, Panel, Grid, Stack, Inline, Tabs, Toolbar, ToolbarGrow, SearchField, Select, MultiSelect, DatePicker, Field, TextField, PasswordField, OTPInput, Checkbox, DataTable, DescriptionList, Avatar, AvatarGroup, StatusPill, Tag, Button, IconButton, Tooltip, DropdownMenu, FormModal, Modal, ConfirmDialog, EmptyState, InlineMessage, AlertBanner, ToastProvider } = window.DS;
const useToast = ToastProvider.useToast;
const { operators } = window.KIT;

const ROLES = [{ value: "owner", label: "소유자" }, { value: "operator", label: "운영자" }, { value: "viewer", label: "조회자" }];
const REGIONS = ["서울", "경기", "부산", "대구", "광주", "대전"].map((r) => ({ value: r, label: r }));
const AUDIT = [
  { id: "1", who: "정유현", what: "edge-seoul-03 재시작", when: "2026-09-09 18:31", ip: "203.0.113.9" },
  { id: "2", who: "김서준", what: "롤아웃 2.15.0-rc1 시작", when: "2026-09-09 18:30", ip: "203.0.113.4" },
  { id: "3", who: "박하늘", what: "장치 운영 모드 변경", when: "2026-09-09 16:30", ip: "203.0.113.7" },
  { id: "4", who: "정유현", what: "운영자 초대 발송", when: "2026-09-08 11:02", ip: null },
];

function AccessScreen() {
  const { toast } = useToast();
  const [tab, setTab] = React.useState("members");
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("");
  const [invite, setInvite] = React.useState(false);
  const [otp, setOtp] = React.useState(null);
  const [code, setCode] = React.useState("");
  const [remove, setRemove] = React.useState(null);
  const [regions, setRegions] = React.useState(["서울"]);
  const [expires, setExpires] = React.useState("2026-12-31");

  const rows = operators.filter((u) => (!role || u.role === role) && (!q || (u.name + u.email).toLowerCase().includes(q.toLowerCase())));
  const noMfa = operators.filter((u) => !u.mfa).length;

  return (
    <PageStack aria-label="접근 관리">
      <PageHeader title="접근" description="콘솔에 들어오는 사람과 그 사람이 만질 수 있는 지역을 관리합니다."
        actions={<>
          <AvatarGroup max={4} size="md" users={operators.map((u) => ({ name: u.name, status: u.status }))} />
          <Button variant="primary" icon="plus" onClick={() => setInvite(true)}>운영자 추가</Button>
        </>} />

      {noMfa > 0 && <AlertBanner tone="warn" title={`2단계 인증을 켜지 않은 계정 ${noMfa}건`}>소유자와 운영자는 2단계 인증이 필수입니다. 계정 행 메뉴에서 재설정을 요청할 수 있습니다.</AlertBanner>}

      <Panel padding="sm">
        <Tabs aria-label="접근 관리 탭" value={tab} onChange={setTab} panelId={(v) => `access-${v}`}
          items={[{ value: "members", label: "운영자", count: operators.length }, { value: "invites", label: "초대", count: 0 }, { value: "audit", label: "감사 로그", count: AUDIT.length }]} />

        {tab === "members" && (
          <Stack gap={3} id="access-members">
            <Toolbar end={<Tooltip content="목록을 CSV로 내려받습니다"><IconButton icon="download" variant="outline" aria-label="운영자 목록 내려받기" /></Tooltip>}>
              <ToolbarGrow><SearchField value={q} onChange={setQ} placeholder="이름이나 메일 주소" aria-label="운영자 검색" /></ToolbarGrow>
              <Select aria-label="역할" value={role} onChange={(e) => setRole(e.target.value)} placeholder="역할 전체" fit="auto" options={ROLES} />
            </Toolbar>
            <DataTable aria-label="운영자" rowKey={(r) => r.id} rows={rows} rowLabel={(r) => r.name}
              empty={<EmptyState face="curious" title="찾는 사람이 없습니다" description="검색어를 지우면 전체 목록으로 돌아갑니다." />}
              columns={[
                { key: "name", header: "이름", render: (r) => <Inline gap={2} align="center" wrap={false}><Avatar size="sm" name={r.name} status={r.status} /><Stack gap={0}><b>{r.name}</b><span className="kit-dim bds-mono">{r.email}</span></Stack></Inline> },
                { key: "roleText", header: "역할", render: (r) => <Tag accent={r.role === "owner"}>{r.roleText}</Tag> },
                { key: "regions", header: "담당 지역", hideBelow: "tablet", render: (r) => (r.regions.length ? <Inline gap={1}>{r.regions.map((g) => <Tag key={g}>{g}</Tag>)}</Inline> : <span className="kit-dim">지정 없음</span>) },
                { key: "mfa", header: "2단계", render: (r) => <StatusPill size="sm" tone={r.mfa ? "ok" : "warn"}>{r.mfa ? "사용 중" : "꺼짐"}</StatusPill> },
                { key: "last", header: "마지막 접속", align: "num", hideBelow: "desktop", render: (r) => r.last ?? "접속 없음" },
                { key: "menu", header: "", width: 44, render: (r) => <DropdownMenu aria-label={`${r.name} 계정 동작`} align="end" items={[
                  { label: "역할 바꾸기", icon: "note-pencil" },
                  { label: "2단계 인증 재설정", icon: "shield-check", onSelect: () => setOtp(r) },
                  { label: "세션 모두 끊기", icon: "sign-out", onSelect: () => toast({ message: `${r.name}의 세션을 끊었습니다.`, tone: "info" }) },
                  "-",
                  { label: "계정 삭제", icon: "trash", danger: true, onSelect: () => setRemove(r) },
                ]} /> },
              ]}
              expandable={(r) => <DescriptionList items={[
                { term: "계정 상태", detail: r.last ? "활성" : "한 번도 접속하지 않음" },
                { term: "마지막 접속", detail: r.last ?? "접속 없음", mono: !!r.last },
                { term: "권한 범위", detail: r.regions.length ? `${r.regions.join(" · ")} 지역의 노드와 장치` : "지정된 지역이 없어 조회만 됩니다." },
              ]} />} />
          </Stack>
        )}

        {tab === "invites" && (
          <div id="access-invites">
            <EmptyState face="curious" title="보낸 초대가 없습니다" description="초대 링크는 72시간 동안만 살아 있고, 받은 사람이 2단계 인증을 켜야 계정이 만들어집니다."
              actions={<Button variant="primary" icon="plus" onClick={() => setInvite(true)}>운영자 추가</Button>} />
          </div>
        )}

        {tab === "audit" && (
          <Stack gap={3} id="access-audit">
            <InlineMessage tone="neutral" icon="info">감사 로그는 90일 보관합니다. 그 이전 기록은 저장소로 넘어갑니다.</InlineMessage>
            <DataTable aria-label="감사 로그" rowKey={(r) => r.id} rows={AUDIT} columns={[
              { key: "when", header: "시각", render: (r) => <span className="bds-mono">{r.when}</span> },
              { key: "who", header: "사용자" },
              { key: "what", header: "동작" },
              { key: "ip", header: "출발지", align: "num", hideBelow: "tablet" },
            ]} />
          </Stack>
        )}
      </Panel>

      <FormModal open={invite} onClose={() => setInvite(false)} title="운영자 추가" description="초대 메일이 나가고, 받은 사람이 2단계 인증을 켜면 계정이 만들어집니다." submitLabel="초대" size="md"
        onSubmit={(e) => { e.preventDefault(); setInvite(false); toast({ message: "초대 메일을 보냈습니다.", tone: "ok" }); }}>
        <Stack gap={3}>
          <Grid cols={2}>
            <Field label="이름" required><TextField placeholder="홍길동" autoComplete="name" /></Field>
            <Field label="메일 주소" required hint="회사 도메인만 받습니다."><TextField type="email" mono placeholder="name@bonggu.me" /></Field>
          </Grid>
          <Grid cols={2}>
            <Field label="역할" required><Select aria-label="역할" defaultValue="operator" options={ROLES} /></Field>
            <Field label="권한 만료일" hint="비우면 만료 없이 유지됩니다."><DatePicker value={expires} onChange={setExpires} min="2026-09-09" /></Field>
          </Grid>
          <Field label="담당 지역" hint="선택한 지역의 노드와 장치만 만질 수 있습니다.">
            <MultiSelect aria-label="담당 지역" options={REGIONS} value={regions} onChange={setRegions} max={4} placeholder="지역을 고릅니다" />
          </Field>
          <Field label="임시 비밀번호" hint="첫 로그인에서 바로 바꾸게 됩니다."><PasswordField strength autoComplete="new-password" /></Field>
          <Checkbox defaultChecked>초대 메일에 콘솔 사용 안내를 함께 보냅니다</Checkbox>
        </Stack>
      </FormModal>

      <Modal open={!!otp} onClose={() => { setOtp(null); setCode(""); }} size="sm" title="2단계 인증 재설정"
        description={otp && `${otp.name}의 인증 앱을 초기화하려면 소유자 인증 코드가 필요합니다.`}
        actions={<><Button variant="secondary" onClick={() => { setOtp(null); setCode(""); }}>취소</Button><Button variant="primary" disabled={code.replace(/\s/g, "").length < 6} onClick={() => { toast({ message: `${otp.name}의 2단계 인증을 초기화했습니다.`, tone: "ok" }); setOtp(null); setCode(""); }}>재설정</Button></>}>
        <Stack gap={3} align="center">
          <OTPInput length={6} value={code} onChange={setCode} onComplete={() => {}} />
          <p className="kit-dim">소유자 계정의 인증 앱에 뜬 6자리를 넣습니다.</p>
        </Stack>
      </Modal>

      <ConfirmDialog open={!!remove} danger confirmLabel="삭제" typeToConfirm={remove?.email} title="계정을 삭제합니다"
        message={<>삭제하면 이 사람의 세션과 토큰이 바로 끊깁니다. 감사 로그에 남은 기록은 지워지지 않습니다.</>}
        onClose={() => setRemove(null)} onConfirm={() => { toast({ message: `${remove.name} 계정을 삭제했습니다.`, tone: "warn" }); setRemove(null); }} />
    </PageStack>
  );
}
window.AccessScreen = AccessScreen;
})();
