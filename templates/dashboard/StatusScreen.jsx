(() => {
const { TopNav, Container, PageHeader, Panel, CardHead, Grid, Stack, Inline, Spacer, Divider, Chart, UptimeBar, Timeline, KeyValues, StatusPill, MascotMark, Button, Link, Icon, AlertBanner } = window.DS;
const { services, uptime, events, ticks, fleet } = window.KIT;

/* 고객이 보는 공개 상태 페이지. 화면이 넷뿐이라 셸 대신 TopNav를 쓴다(readme의 이동 선택 규칙). */
function StatusScreen({ onBack }) {
  const [view, setView] = React.useState("now");
  const degraded = services.some((s) => s.tone !== "ok");
  const pick = (v) => (e) => { e.preventDefault(); setView(v); };
  const links = [
    { label: "현재 상태", href: "#status", active: view === "now", onClick: pick("now") },
    { label: "지난 사건", href: "#status", active: view === "past", onClick: pick("past") },
    { label: "도움말", href: "#settings", icon: "question" },
  ];
  return (
    <div className="kit-public">
      <TopNav sticky brand={{ name: "봉구 엣지 상태" }} links={links}
        end={<><StatusPill tone={degraded ? "warn" : "ok"} pulse>{degraded ? "일부 지연" : "모든 서비스 정상"}</StatusPill><Button size="sm" variant="ghost" icon="arrow-left" onClick={onBack}>콘솔로</Button></>} />
      <Container pad>
        <Stack gap={5}>
          <PageHeader title="서비스 상태" description="봉구 엣지가 제공하는 서비스의 현재 상태와 지난 90일 가용성입니다. 값은 5분마다 갱신됩니다."
            actions={<MascotMark face={degraded ? "worried" : "smiling"} size="sm" />} />

          {degraded && <AlertBanner tone="warn" title="수집 파이프라인 지연">지표가 최대 3분까지 늦게 반영되고 있습니다. 서비스 사용에는 영향이 없습니다.</AlertBanner>}

          {view === "now" ? (
            <>
              <Panel>
                <CardHead title="서비스별 가용성" meta="최근 90일" />
                <Stack gap={4}>
                  {services.map((s, i) => (
                    <Stack key={s.name} gap={2}>
                      <Inline align="center" gap={2}>
                        <b>{s.label}</b>
                        <span className="kit-dim bds-mono">{s.name}</span>
                        <Spacer />
                        <StatusPill tone={s.tone} size="sm">{s.text}</StatusPill>
                      </Inline>
                      <UptimeBar segments={uptime(i + 1, s.tone === "warn")} start="90일 전" end="오늘" />
                    </Stack>
                  ))}
                </Stack>
              </Panel>

              <Grid cols={2}>
                <Panel>
                  <CardHead title="응답시간" meta="24시간 · p95" />
                  <Chart kind="line" aria-label="공개 응답시간 추이" height={170} labels={ticks} xTicks="ends" showLegend={false}
                    valueFormatter={(v) => `${v} ms`} series={[{ label: "p95", tone: 1, values: fleet.p95 }]} />
                </Panel>
                <Panel>
                  <CardHead title="지금" />
                  <KeyValues lined rows={services.map((s) => [s.label, s.latency == null ? null : `${s.latency} ms`])} />
                  <Divider />
                  <Inline gap={2} align="center">
                    <Icon name="clock" size={16} />
                    <span className="kit-dim">마지막 확인 <span className="bds-mono">18:45</span></span>
                  </Inline>
                </Panel>
              </Grid>
            </>
          ) : (
            <Panel>
              <CardHead title="지난 사건" meta="최근 7일" />
              <Timeline aria-label="지난 사건" items={events.map(([time, title, detail, tone, icon]) => ({ id: title, time, title, detail, tone, icon }))} />
            </Panel>
          )}

          <Inline gap={2} align="center" className="kit-foot">
            <span className="kit-dim">이 페이지는 콘솔과 같은 디자인 시스템으로 그립니다.</span>
            <Spacer />
            <Link href="https://grafana.example" external>지표 원본</Link>
          </Inline>
        </Stack>
      </Container>
    </div>
  );
}
window.StatusScreen = StatusScreen;
})();
