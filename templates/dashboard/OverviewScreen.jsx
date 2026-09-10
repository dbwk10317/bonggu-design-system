(() => {
const { PageStack, PageHeader, Panel, CardHead, Grid, GridItem, Stack, Inline, Spacer, Divider, Visible, Chart, StatTile, TrendDelta, Sparkline, Gauge, BarList, KeyValues, Heatmap, Legend, UptimeBar, Timeline, StatusPill, Tag, Icon, Link, Button, IconButton, Popover, AlertBanner, Skeleton, Spinner, EmptyState, ErrorState, MascotMark } = window.DS;
const { fleet: F, ticks, days, hours, nodes, services, uptime, events, fmt } = window.KIT;

const sum = (a) => a.reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0);
const region = (name) => nodes.filter((n) => n.region === name).length;

function OverviewScreen() {
  const [failed, setFailed] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);
  const requests = sum(F.requests), errors = sum(F.errors);

  return (
    <PageStack aria-label="함대 개요">
      <PageHeader title="개요" description="전국 14개 지점에 설치한 엣지 노드 38대의 상태를 5초마다 갱신해 한 화면에서 봅니다."
        actions={<>
          <Visible above="lg"><Button variant="secondary" size="sm" icon="download">보고서 내려받기</Button></Visible>
          <Popover title="이 화면을 읽는 법" trigger={<IconButton icon="question" variant="ghost" size="sm" aria-label="개요 화면 설명" />}>
            <Stack gap={2}>
              <p>수치는 게이트웨이가 5초마다 모아 둔 값입니다. 수집이 끊긴 구간은 0으로 채우지 않고 <b>수집 안 됨</b>으로 남깁니다.</p>
              <p>노드 하나가 실패해도 페이지 전체가 실패하지 않습니다. 해당 카드만 결측이나 오류로 표시됩니다.</p>
            </Stack>
          </Popover>
        </>} />

      <AlertBanner tone="warn" title="수집 지연 2건">
        <b className="bds-mono">edge-seoul-03</b> 메모리 88%로 표본을 건너뛰고 있습니다. · <b className="bds-mono">edge-busan-02</b> 응답이 340 ms까지 늘었습니다. 자세한 내용은 <Link href="#nodes">노드 화면</Link>에서 봅니다.
      </AlertBanner>

      <div className="bds-metric-grid">
        <StatTile icon="hard-drives" label="온라인 노드" value={F.online} unit="대" pill={{ tone: "warn", text: "지연 2대" }} detail={<>전체 {F.nodes}대 · 지점 {F.sites}곳</>} spark={[36, 37, 37, 36, 35, 35, 36, 35]} tone={1} />
        <StatTile icon="lightning" label="오늘 요청" value={requests} unit="건" delta="+8.2%" deltaLabel="어제 대비" spark={F.requests.slice(-10)} tone={2} />
        <StatTile icon="warning" label="오류" value={errors} unit="건" delta={12} deltaLabel="1시간" tone={5} detail={<>오류율 {(errors / requests * 100).toFixed(2)}%</>} />
        <StatTile icon="timer" label="응답 p95" value={null} unit="ms" pill={{ tone: "off", text: "수집기 재시작" }} detail={<>직전 값 <span className="bds-mono">214 ms</span></>} />
      </div>

      <Grid columns={12}>
        <GridItem span={8} spanMd={12}>
          <Panel enter>
            <CardHead title="요청과 오류" meta="24시간 · 1시간 단위" />
            <Chart kind="bar" aria-label="시간별 요청과 오류" height={190} labels={ticks} xTicks="auto" stacked valueFormatter={(v) => `${v}건`}
              series={[{ label: "성공", tone: 2, values: F.requests }, { label: "오류", tone: 5, values: F.errors }]} />
          </Panel>
        </GridItem>
        <GridItem span={4} spanMd={6}>
          <Panel enter>
            <CardHead title="노드 상태" meta={`${F.nodes}대`} />
            <Chart kind="pie" aria-label="노드 상태 구성" height={150} caption="노드 전체" valueFormatter={(v) => `${v}대`}
              segments={[{ label: "정상", value: F.online, tone: 1 }, { label: "수집 지연", value: F.degraded, tone: 4 }, { label: "연결 끊김", value: F.offline, tone: 5 }]} />
            <KeyValues rows={[["서울", `${region("서울")}대`], ["경기", `${region("경기")}대`], ["그 외", `${nodes.length - region("서울") - region("경기")}대`]]} />
          </Panel>
        </GridItem>
        <GridItem span={4} spanMd={6}>
          <Panel enter>
            <CardHead title="게이트웨이" meta="gw-01" metaMono />
            <Inline justify="space-between" align="center">
              <Gauge fit="fixed" width={140} value={0.63} label="CPU 사용률" ticks valueFormatter={(v) => `${Math.round(v * 100)}%`} />
              <Gauge fit="fixed" width={140} value={null} label="업링크" />
            </Inline>
            <Divider />
            <BarList aria-label="지역별 요청 비중" thresholds={{ warn: 70, crit: 90 }} valueFormatter={(v) => `${v.toFixed(0)}%`}
              items={[{ name: "서울", value: 44 }, { name: "경기", value: 21 }, { name: "부산", value: 18 }, { name: "대전", value: null }]} />
          </Panel>
        </GridItem>
        <GridItem span={8} spanMd={12}>
          <Panel enter>
            <CardHead title="응답시간 p95" meta="임계 400 ms" />
            <Chart kind="line" aria-label="응답시간 p95" height={190} labels={ticks} xTicks="ends" valueFormatter={(v) => `${v} ms`}
              series={[{ label: "게이트웨이", tone: 1, values: F.p95 }]} thresholds={[{ value: 400, label: "위험 400 ms", tone: "crit" }, { value: 250, label: "주의 250 ms", tone: "warn" }]} showLegend={false} />
            <Inline gap={2} align="center">
              <span className="kit-dim">06시~07시는 수집기 재시작 구간이라 선을 끊었습니다.</span>
              <Spacer />
              <TrendDelta value={-0.06} percent inverse label="어제 대비" />
            </Inline>
          </Panel>
        </GridItem>
      </Grid>

      <Grid cols={2}>
        <Panel enter>
          <CardHead title="부하 프로필" meta="지금 · 1주 평균" />
          <Chart kind="radar" aria-label="자원별 부하 프로필" height={240} max={100} axes={["CPU", "메모리", "디스크", "네트워크", "디스플레이"]}
            series={[{ label: "지금", tone: 2, values: [38, 54, 41, 62, null] }, { label: "1주 평균", tone: 1, values: [33, 49, 40, 55, 71] }]} />
        </Panel>
        <Panel enter>
          <CardHead title="응답시간 분포" meta="표본 160개" />
          <Chart kind="histogram" aria-label="응답시간 분포" height={240} samples={F.samples} unit="ms" percentiles={[0.5, 0.95]} tone={3} />
        </Panel>
      </Grid>

      <Panel enter>
        <CardHead title="주간 요청 분포" meta="요일 × 2시간" />
        <Heatmap aria-label="요일과 시간대별 요청량" rows={days} cols={hours} values={F.load} cell={18} valueFormatter={(v) => `${v}만 건`} />
        <p className="kit-dim">일요일 20시 이후는 아직 수집 대상이 아닙니다. 빈 칸이 아니라 결측으로 표시됩니다.</p>
      </Panel>

      <Grid cols={2}>
        <Panel enter>
          <CardHead title="90일 가용성" meta="off 구간은 분모에서 제외" />
          <Stack gap={3}>
            {services.slice(0, 4).map((s, i) => <UptimeBar key={s.name} name={s.label} start="90일 전" end="오늘" segments={uptime(i + 1, s.tone === "warn")} />)}
          </Stack>
          <Divider />
          <Legend shape="square" items={[{ label: "정상", tone: "ok" }, { label: "수집 지연", tone: "warn" }, { label: "연결 끊김", tone: "crit" }, { label: "설치 전", color: "var(--neutral)" }]} />
        </Panel>
        <Panel enter>
          <CardHead title="최근 운영 변화" meta="오늘" />
          <Timeline aria-label="최근 운영 변화" items={events.map(([time, title, detail, tone, icon]) => ({ id: title, time, title, detail, tone, icon }))} />
          <Inline gap={2} align="center">
            <Icon name="broadcast" size={16} />
            <span className="kit-dim">공개 상태 페이지에도 같은 사건이 올라갑니다.</span>
            <Spacer />
            <Link href="#status">상태 페이지</Link>
          </Inline>
        </Panel>
      </Grid>

      <Grid cols={3}>
        <Panel enter>
          <CardHead title="네트워크" meta="게이트웨이 업링크" />
          {loading ? <Stack gap={2}><Skeleton variant="text" lines={2} /><Skeleton height={90} /></Stack> : <>
            <Chart kind="area" aria-label="업링크 처리량" height={110} labels={ticks} xTicks="ends" valueFormatter={(v) => `${v} Mb/s`}
              series={[{ label: "수신", tone: "rx", values: F.rx }, { label: "송신", tone: "tx", values: F.tx }]} />
            <KeyValues rows={[["수신", fmt.mbps(F.rx[F.rx.length - 1])], ["송신", fmt.mbps(F.tx[F.tx.length - 1])]]} />
          </>}
        </Panel>
        <Panel enter>
          <CardHead title="설정 배포" meta={<Inline gap={2} align="center"><Spinner size={14} /><span>내려받는 중</span></Inline>} />
          <Stack gap={3}>
            <Inline gap={3} align="center">
              <div className="kit-spark"><Sparkline values={[12, 18, 15, 22, 26, 24, 31, 29, 34]} tone={4} area /></div>
              <Stack gap={1}>
                <b className="bds-mono">34 / 38</b>
                <span className="kit-dim">새 프로파일을 받은 노드</span>
              </Stack>
            </Inline>
            <Inline gap={2}><Tag icon="sliders">store-default</Tag><Tag>30초 갱신</Tag><StatusPill tone="info" size="sm" pulse>배포 중</StatusPill></Inline>
          </Stack>
        </Panel>
        <Panel enter>
          <CardHead title="전력 사용량" meta="지점 합계" />
          {failed
            ? <ErrorState title="전력 데이터를 불러오지 못했습니다" description="계량기 API가 504를 돌려주었고, 다시 시도하면 마지막 집계부터 채웁니다." code="GW-504 · req_8f21c0" onRetry={() => setFailed(false)} retryLabel="다시 시도" />
            : <EmptyState plain face="curious" title="집계 구간이 아직 없습니다" description="계량기가 정시마다 값을 올려 다음 정시에 첫 구간이 채워집니다." />}
        </Panel>
      </Grid>

      <Inline gap={2} align="center" className="kit-foot">
        <MascotMark face="neutral" size="xxs" animated={false} />
        <span className="kit-dim">이 화면은 봉구 디자인 시스템 컴포넌트만으로 조립한 예시입니다.</span>
        <Spacer />
        <Link href="https://grafana.example" external>Grafana에서 원본 지표 보기</Link>
      </Inline>
    </PageStack>
  );
}
window.OverviewScreen = OverviewScreen;
})();
