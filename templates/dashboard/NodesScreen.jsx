(() => {
const { PageStack, PageHeader, Panel, Stack, Inline, Spacer, Toolbar, ToolbarGrow, SearchField, Select, MultiSelect, DateRangePicker, DataTable, DropdownMenu, Pagination, Drawer, Breadcrumb, Tabs, DescriptionList, KeyValues, Chart, LogViewer, CopyField, Code, Sparkline, StatusPill, Tag, Badge, Avatar, AvatarGroup, Button, IconButton, Tooltip, InlineMessage, LoadingOverlay, ConfirmDialog, EmptyState, useToast } = window.DS;
const { nodes, ticks, logs, fmt } = window.KIT;

const TONE = { online: ["ok", "정상"], degraded: ["warn", "수집 지연"], offline: ["crit", "연결 끊김"] };
const REGIONS = [...new Set(nodes.map((n) => n.region))];
const PAGE = 8;
const trend = (base) => Array.from({ length: 12 }, (_, i) => (base == null ? null : Math.round(base + Math.sin(i / 2) * 6)));

function NodeDetail({ node }) {
  const [tab, setTab] = React.useState("summary");
  const [tone, text] = TONE[node.status];
  return (
    <Stack gap={4}>
      <Breadcrumb items={[{ label: "노드", href: "#nodes" }, { label: node.region }, { label: node.site }, { label: <span className="bds-mono">{node.id}</span> }]} />
      <Tabs aria-label="노드 상세" value={tab} onChange={setTab} panelId={(v) => `node-${v}`}
        items={[{ value: "summary", label: "요약", icon: "info" }, { value: "metrics", label: "지표", icon: "pulse" }, { value: "logs", label: "로그", count: logs.length }]} />
      {tab === "summary" && (
        <Stack gap={4} id="node-summary">
          <Inline gap={2} align="center"><StatusPill tone={tone}>{text}</StatusPill><Tag icon="map-pin">{node.region}</Tag><Tag>{node.model}</Tag><Spacer /><AvatarGroup max={3} size="sm" users={[{ name: node.owner, status: "ok" }, { name: "박하늘" }, { name: "이도윤" }]} /></Inline>
          <DescriptionList items={[
            { term: "설치 지점", detail: node.site },
            { term: "에이전트", detail: `bonggu-edge-agent ${node.agent}`, mono: true },
            { term: "설치일", detail: node.since, mono: true },
            { term: "역할", detail: "매장 안내 단말 구동과 결제 리더기 중계를 함께 맡습니다." },
          ]} />
          <KeyValues lined rows={[["CPU", fmt.pct(node.cpu)], ["메모리", fmt.pct(node.mem)], ["디스크", fmt.pct(node.disk)], ["온도", fmt.temp(node.temp)], ["응답", fmt.ms(node.latency)], ["업타임", fmt.up(node.uptime)], ["안내 단말", node.display]]} />
          <Stack gap={2}>
            <CopyField label="노드 식별자" value={node.id} />
            <CopyField label="점검 명령" multiline value={`curl -s https://edge.bonggu.me/api/nodes/${node.id}/health \\\n  -H "Authorization: Bearer $BONGGU_TOKEN"`} />
          </Stack>
          <p className="kit-dim">설정 파일은 <Code>/etc/bonggu/edge.toml</Code>에 있고 에이전트가 재시작 없이 다시 읽습니다.</p>
        </Stack>
      )}
      {tab === "metrics" && (
        <Stack gap={4} id="node-metrics">
          <Chart kind="area" aria-label="노드 자원 사용률" height={180} labels={ticks.slice(0, 12)} xTicks="ends" valueFormatter={(v) => `${v}%`}
            series={[{ label: "CPU", tone: 1, values: trend(node.cpu) }, { label: "메모리", tone: 3, values: trend(node.mem) }]} />
          <Chart kind="line" aria-label="노드 응답시간" height={150} labels={ticks.slice(0, 12)} xTicks="ends" valueFormatter={(v) => `${v} ms`}
            series={[{ label: "응답", tone: 2, values: trend(node.latency) }]} thresholds={[{ value: 300, label: "위험 300 ms", tone: "crit" }]} showLegend={false} />
        </Stack>
      )}
      {tab === "logs" && <LogViewer id="node-logs" aria-label="노드 로그" lines={logs} numbers height={280} />}
    </Stack>
  );
}

function NodesScreen() {
  const { toast } = useToast();
  const [q, setQ] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [states, setStates] = React.useState(/** @type {string[]} */ (["online", "degraded", "offline"]));
  const [range, setRange] = React.useState(/** @type {import("../../components/input/DateRangePicker.d.ts").DateRange} */ ({ preset: "24h" }));
  const [sort, setSort] = React.useState(/** @type {import("../../components/data/DataTable.d.ts").DataTableSort} */ ({ key: "id", dir: "asc" }));
  const [selected, setSelected] = React.useState(/** @type {import("react").Key[]} */ ([]));
  const [page, setPage] = React.useState(1);
  const [busy, setBusy] = React.useState(false);
  const [detail, setDetail] = React.useState(/** @type {typeof nodes[number] | null} */ (null));
  const [isolate, setIsolate] = React.useState(/** @type {typeof nodes[number] | null} */ (null));

  const filtered = nodes
    .filter((n) => states.includes(n.status))
    .filter((n) => !region || n.region === region)
    .filter((n) => !q || (n.id + n.site).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => { const [x, y] = [a[sort.key], b[sort.key]]; const d = x == null ? 1 : y == null ? -1 : x > y ? 1 : x < y ? -1 : 0; return sort.dir === "asc" ? d : -d; });
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const shown = filtered.slice((page - 1) * PAGE, page * PAGE);
  const refresh = () => { setBusy(true); setTimeout(() => { setBusy(false); toast({ message: "노드 목록을 다시 읽었습니다.", tone: "ok" }); }, 900); };
  const rowMenu = /** @type {(n: typeof nodes[number]) => ("-" | import("../../components/overlay/DropdownMenu.d.ts").MenuItem)[]} */ ((n) => [
    { label: "상세 열기", icon: "arrow-right", onSelect: () => setDetail(n) },
    { label: "에이전트 재시작", icon: "arrow-clockwise", onSelect: () => toast({ message: `${n.id} 재시작을 요청했습니다.`, tone: "info" }) },
    { label: "설정 다시 읽기", icon: "arrows-clockwise", onSelect: () => toast({ message: `${n.id} 설정을 다시 읽었습니다.`, tone: "ok" }) },
    "-",
    { label: "격리", icon: "plugs", danger: true, onSelect: () => setIsolate(n) },
  ]);

  return (
    <PageStack aria-label="노드 목록">
      <PageHeader title="노드" description="지점에 설치한 엣지 노드를 찾고, 상태를 확인하고, 에이전트를 다시 시작합니다."
        actions={<>
          <Tooltip content="목록을 다시 읽습니다"><IconButton icon="arrows-clockwise" variant="outline" aria-label="목록 다시 읽기" onClick={refresh} /></Tooltip>
          <Button variant="primary" icon="plus">노드 등록</Button>
        </>} />

      <Panel padding="sm">
        <Toolbar end={<Inline gap={2} align="center"><Badge count={filtered.length} tone="neutral" /><span className="kit-dim">대 표시 중</span></Inline>}>
          <ToolbarGrow><SearchField value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="노드 식별자나 지점 이름" aria-label="노드 검색" /></ToolbarGrow>
          <Select aria-label="지역" value={region} onChange={(e) => { setRegion(e.target.value); setPage(1); }} placeholder="지역 전체" fit="auto" options={REGIONS.map((r) => ({ value: r, label: r }))} />
          <MultiSelect aria-label="상태 필터" value={states} onChange={(v) => { setStates(v); setPage(1); }} placeholder="상태 선택" fit="fixed" width={220}
            options={[{ value: "online", label: "정상" }, { value: "degraded", label: "수집 지연" }, { value: "offline", label: "연결 끊김" }]} />
          <DateRangePicker aria-label="집계 기간" value={range} onChange={setRange} presets={[{ value: "1h", label: "최근 1시간" }, { value: "24h", label: "최근 24시간" }, { value: "7d", label: "최근 7일" }]} />
        </Toolbar>
        {states.length < 3 && <InlineMessage tone="info" icon="funnel">상태 필터가 걸려 있습니다. 전체 {nodes.length}대 중 {filtered.length}대만 보고 있습니다.</InlineMessage>}
      </Panel>

      <LoadingOverlay active={busy} label="노드 목록을 다시 읽는 중">
        <DataTable aria-label="노드" rowKey={(r) => r.id} rows={shown} sort={sort} onSortChange={(s) => setSort(s)}
          header={{ title: "설치 노드", meta: <><span className="bds-mono">5</span>초 전 갱신</> }}
          selectable selectedKeys={selected} onSelectionChange={setSelected}
          bulkActions={<><Button size="sm" variant="secondary" icon="arrow-clockwise" onClick={() => toast({ message: `${selected.length}대 재시작을 요청했습니다.`, tone: "info" })}>재시작</Button><Button size="sm" variant="danger" icon="plugs" onClick={() => setIsolate(shown.find((n) => n.id === selected[0]))}>격리</Button></>}
          empty={<EmptyState face="curious" title="조건에 맞는 노드가 없습니다" description="검색어를 지우거나 상태 필터를 다시 켜면 전체 목록으로 돌아갑니다." actions={<Button size="sm" onClick={() => { setQ(""); setRegion(""); setStates(["online", "degraded", "offline"]); }}>필터 초기화</Button>} />}
          rowLabel={(r) => r.id}
          columns={[
            { key: "id", header: "노드", sortable: true, render: (r) => <button type="button" className="kit-linkcell bds-mono" onClick={() => setDetail(r)}>{r.id}</button> },
            { key: "site", header: "지점", sortable: true },
            { key: "region", header: "지역", hideBelow: "tablet" },
            { key: "status", header: "상태", render: (r) => <StatusPill size="sm" tone={TONE[r.status][0]}>{TONE[r.status][1]}</StatusPill> },
            { key: "cpu", header: "CPU %", align: "num", sortable: true },
            { key: "mem", header: "메모리 %", align: "num", hideBelow: "tablet" },
            { key: "temp", header: "온도", align: "num", hideBelow: "desktop", render: (r) => fmt.temp(r.temp) },
            { key: "latency", header: "응답", align: "num", render: (r) => fmt.ms(r.latency) },
            { key: "owner", header: "담당", hideBelow: "desktop", render: (r) => <Inline gap={2} align="center" wrap={false}><Avatar size="xs" name={r.owner} status={r.status === "offline" ? "off" : "ok"} /><span>{r.owner}</span></Inline> },
            { key: "menu", header: "", width: 44, render: (r) => <DropdownMenu aria-label={`${r.id} 행 동작`} align="end" items={rowMenu(r)} /> },
          ]}
          expandable={(r) => (
            <Stack gap={3}>
              <Inline gap={4} align="center">
                <div className="kit-spark"><Sparkline values={trend(r.cpu)} tone={1} area /></div>
                <KeyValues rows={[["에이전트", r.agent], ["업타임", fmt.up(r.uptime)], ["안내 단말", r.display]]} />
              </Inline>
              <CopyField label="노드 식별자" value={r.id} />
            </Stack>
          )} />
      </LoadingOverlay>

      <Inline align="center">
        <span className="kit-dim">한 쪽에 {PAGE}대씩 보여 줍니다.</span>
        <Spacer />
        <Pagination page={page} total={pages} onChange={setPage} info={`${(page - 1) * PAGE + 1}–${Math.min(page * PAGE, filtered.length)} / ${filtered.length}`} />
      </Inline>

      <Drawer open={!!detail} onClose={() => setDetail(null)} size="lg" title={detail?.site} description={detail && <span className="bds-mono">{detail.id} · {detail.model}</span>}
        actions={<><Button variant="secondary" onClick={() => toast({ message: "설정을 다시 읽었습니다.", tone: "ok" })}>설정 다시 읽기</Button><Button variant="primary" onClick={() => { toast({ message: `${detail.id} 재시작을 요청했습니다.`, tone: "info" }); setDetail(null); }}>재시작</Button></>}>
        {detail && <NodeDetail node={detail} />}
      </Drawer>

      <ConfirmDialog open={!!isolate} danger typeToConfirm={isolate?.id} confirmLabel="격리" title="노드를 격리합니다"
        message={<>격리하면 이 노드는 게이트웨이에서 떨어져 나가고 매장 디스플레이가 마지막 화면에서 멈춥니다. 되돌리려면 현장 재연결이 필요합니다.</>}
        onClose={() => setIsolate(null)} onConfirm={() => { toast({ message: `${isolate.id}를 격리했습니다.`, tone: "warn" }); setIsolate(null); }} />
    </PageStack>
  );
}
window.NodesScreen = NodesScreen;
})();
