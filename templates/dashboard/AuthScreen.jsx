(() => {
const { PageStack, PageHeader, Panel, StatusPill, Tag, Tabs, Toolbar, ToolbarGrow, SearchField, Select, Button, DataTable, FormModal, Field, TextField, Checkbox, EmptyState, DescriptionList, ToastProvider, Modal } = window.DS;
const useToast = ToastProvider.useToast;
const { users: USERS, roles: ROLES } = window.KIT;

function AuthScreen() {
  const { toast } = useToast();
  const [tab, setTab] = React.useState("users");
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState([]);
  const [modal, setModal] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [del, setDel] = React.useState(null);
  const rows = USERS.filter((u) => !q || u.name.includes(q) || u.email.includes(q));
  const save = () => { setBusy(true); setTimeout(() => { setBusy(false); setModal(null); toast({ message: modal === "create" ? "사용자를 추가했습니다." : "변경사항을 저장했습니다.", tone: "ok" }); }, 700); };
  return (
    <>
      <PageStack aria-label="인증 콘솔">
        <PageHeader title="인증" description="ZITADEL 사용자, 프로젝트 역할, 사용자별 역할 할당을 관리합니다. 관리 작업은 서버에서 감사 기록됩니다." actions={<StatusPill tone="ok">ZITADEL 연결됨</StatusPill>} />
        <Tabs aria-label="인증 콘솔" value={tab} onChange={setTab} items={[{ value: "users", label: "사용자", count: USERS.length }, { value: "roles", label: "역할", count: ROLES.length }, { value: "grants", label: "할당" }]} />
        {tab === "users" && (
          <>
            <Toolbar end={<Button variant="primary" icon="plus" onClick={() => setModal("create")}>사용자 추가</Button>}>
              <ToolbarGrow><SearchField value={q} onChange={setQ} placeholder="이름 또는 이메일 검색" /></ToolbarGrow>
              <Select fit="auto" defaultValue="all" aria-label="역할 필터" options={[{ value: "all", label: "모든 역할" }, ...ROLES.map(([r]) => ({ value: r, label: r }))]} />
            </Toolbar>
            <DataTable aria-label="사용자" rows={rows} rowKey={(r) => r.id} rowLabel={(r) => r.name} selectable selectedKeys={sel} onSelectionChange={setSel}
              bulkActions={<><Button size="sm" variant="secondary">역할 부여</Button><Button size="sm" variant="danger" onClick={() => setDel(sel.length)}>삭제</Button></>}
              empty={<EmptyState plain title="검색 결과가 없습니다" description="다른 이름이나 이메일로 다시 검색해 보세요." />}
              columns={[{ key: "name", header: "이름", sortable: true, render: (r) => <b style={{ fontWeight: 600 }}>{r.name}</b> }, { key: "email", header: "이메일", hideBelow: "tablet", render: (r) => <span className="bds-mono">{r.email}</span> },
                { key: "roles", header: "역할", render: (r) => <span className="kit-tags">{r.roles.map((x) => <Tag key={x}>{x}</Tag>)}</span> }, { key: "state", header: "상태", render: (r) => <StatusPill size="sm" tone={r.state === "활성" ? "ok" : "off"}>{r.state}</StatusPill> },
                { key: "last", header: "마지막 로그인", align: "num", hideBelow: "desktop" }, { key: "act", header: "", render: (r) => <Button size="sm" variant="ghost" onClick={() => setModal(r)}>편집</Button> }]}
              sort={{ key: "name", dir: "asc" }} onSortChange={() => {}} expandable={(r) => <DescriptionList items={[{ term: "이메일", detail: r.email, mono: true }, { term: "마지막 로그인", detail: r.last, mono: true }, { term: "역할", detail: r.roles.join(", ") }]} />} />
          </>
        )}
        {tab === "roles" && (
          <>
            <Toolbar end={<Button variant="primary" icon="plus">역할 추가</Button>}><p className="kit-dim">프로젝트 역할은 ZITADEL 프로젝트에 저장되고 사용자에게 할당됩니다.</p></Toolbar>
            <DataTable aria-label="역할" rows={ROLES.map(([key, desc, n]) => ({ key, desc, n }))} rowKey={(r) => r.key}
              columns={[{ key: "key", header: "키", render: (r) => <span className="bds-mono">{r.key}</span> }, { key: "desc", header: "설명" }, { key: "n", header: "할당", align: "num", render: (r) => `${r.n}명` }, { key: "act", header: "", render: () => <Button size="sm" variant="ghost">편집</Button> }]} />
          </>
        )}
        {tab === "grants" && <EmptyState title="사용자를 먼저 선택하세요" description="사용자 탭에서 한 명을 고르면 역할 할당을 여기서 편집합니다." actions={<Button size="sm" onClick={() => setTab("users")}>사용자 탭으로</Button>} />}
      </PageStack>
      <FormModal open={!!modal} onClose={() => setModal(null)} onSubmit={save} busy={busy} title={modal === "create" ? "사용자 추가" : `${modal?.name} 편집`} description="변경은 ZITADEL에 즉시 저장됩니다." submitLabel={modal === "create" ? "추가" : "저장"}>
        <Field label="이름" required><TextField autoFocus defaultValue={modal?.name ?? ""} /></Field>
        <Field label="이메일" required hint="로그인 ID로 쓰입니다"><TextField type="email" mono defaultValue={modal?.email ?? ""} placeholder="name@bonggu.me" /></Field>
        <div className="bds-field"><span className="bds-field__label">역할</span><div className="kit-checks">{ROLES.map(([r]) => <Checkbox key={r} defaultChecked={modal?.roles?.includes(r)}>{r}</Checkbox>)}</div></div>
      </FormModal>
      <Modal open={del != null} onClose={() => setDel(null)} size="sm" title={`사용자 ${del}명을 삭제할까요?`} description="삭제한 사용자는 복구할 수 없습니다. 활성 세션은 즉시 종료됩니다." actions={<><Button variant="ghost" onClick={() => setDel(null)}>취소</Button><Button variant="danger" onClick={() => { setDel(null); setSel([]); toast({ message: "사용자를 삭제했습니다." }); }}>삭제</Button></>} />
    </>
  );
}
window.AuthScreen = AuthScreen;
})();
