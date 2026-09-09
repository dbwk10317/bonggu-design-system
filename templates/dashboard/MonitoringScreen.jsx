(() => {
const { Panel, CardHead, Chart, KeyValues, BarList, DataTable, StatusPill, PageStack, Grid, StatTile, PageHeader, AlertBanner, EmptyState, Tag, Timeline } = window.DS;
const { overview: O, hub: H, ticks, fmt } = window.KIT;

const usageTone = (p) => (p == null ? "off" : p >= 85 ? "crit" : p >= 70 ? "warn" : "ok");
const usageText = (p) => (p == null ? "수집 안 됨" : p >= 85 ? "위험" : p >= 70 ? "주의" : "정상");
const radialTone = (p) => (p == null ? "ok" : p >= 90 ? "crit" : p >= 70 ? "warn" : "ok");

function Meter({ label, pct, tone, status }) {
  return <Chart kind="radial" fit="fixed" width={124} height={92} aria-label={label} value={pct == null ? null : Math.min(pct, 100) / 100} label={status} tone={tone} valueFormatter={(v) => fmt.pct(pct ?? v * 100, (pct ?? 0) < 10 ? 1 : 0)} />;
}
function MeterCard({ title, meta, metaMono, pct, status, tone, rows }) {
  return (
    <Panel padding="sm" enter>
      <CardHead title={title} meta={meta} metaMono={metaMono} />
      <div className="kit-row2"><Meter label={`${title} 사용률`} pct={pct} tone={tone} status={status} /><KeyValues rows={rows} /></div>
    </Panel>
  );
}

function MonitoringScreen({ mobile }) {
  const disk = O.disks[0];
  return (
    <PageStack aria-label="모니터링 지표">
      <div className="kit-strip" role="group" aria-label="핵심 상태 요약">
        <StatusPill tone={usageTone(O.cpu.usage_percent)} size="sm">CPU {fmt.pct(O.cpu.usage_percent)}</StatusPill>
        <StatusPill tone={usageTone(O.memory.usage_percent)} size="sm">메모리 {fmt.pct(O.memory.usage_percent)}</StatusPill>
        <StatusPill tone={usageTone(O.gpu.usage_percent)} size="sm">GPU {fmt.pct(O.gpu.usage_percent)}</StatusPill>
        <StatusPill tone="crit" size="sm">sda {fmt.pct(O.disks[1].usage_percent)}</StatusPill>
      </div>
      <Grid cols={3}>
        <MeterCard title="CPU" meta={O.cpu.model} metaMono pct={O.cpu.usage_percent} status={usageText(O.cpu.usage_percent)} tone={radialTone(O.cpu.usage_percent)} rows={[["온도", fmt.temp(O.cpu.temperature_c)], ["로드 (1m)", O.cpu.load_1m.toFixed(2)], ["실행 중", O.cpu.running_processes]]} />
        <MeterCard title="메모리" meta={fmt.bytes(O.memory.total_bytes)} metaMono pct={O.memory.usage_percent} status={usageText(O.memory.usage_percent)} tone={radialTone(O.memory.usage_percent)} rows={[["사용", `${fmt.bytes(O.memory.used_bytes)} / ${fmt.bytes(O.memory.total_bytes)}`], ["캐시", fmt.bytes(O.memory.cached_bytes)], ["스왑", fmt.bytes(O.memory.swap_used_bytes)]]} />
        <MeterCard title="GPU" meta={O.gpu.model} metaMono pct={O.gpu.usage_percent} status={O.gpu.usage_percent > 5 ? "사용 중" : "대기"} tone={radialTone(O.gpu.usage_percent)} rows={[["VRAM", `${fmt.bytes(O.gpu.vram_used_bytes)} / ${fmt.bytes(O.gpu.vram_total_bytes)}`], ["온도", fmt.temp(O.gpu.temperature_c)], ["전력", `${O.gpu.power_watts} W`]]} />
        <Panel padding="sm" enter>
          <CardHead title="메인보드" meta="sensors" />
          <div className="kit-row2"><Chart kind="radial" fit="fixed" width={124} height={92} aria-label="시스템 온도" value={O.motherboard.temperature_c / 100} label="정상" tone="ok" valueFormatter={() => fmt.temp(O.motherboard.temperature_c)} />
            <KeyValues rows={[["펌프", `${O.motherboard.pump_rpm} rpm`], ["라디에이터 팬", `${O.motherboard.radiator_fan_rpm} rpm`], ["케이스 팬", `${O.motherboard.case_fan_rpm} rpm`], ["시스템 전력", `${O.power.watts} W`]]} /></div>
        </Panel>
        <Panel padding="sm" enter>
          <CardHead title="네트워크" meta={O.network.interface} metaMono />
          <Chart kind="area" aria-label="네트워크 처리량" height={118} labels={ticks} xTicks="ends" series={[{ label: "수신", tone: "rx", values: O.network.rx }, { label: "송신", tone: "tx", values: O.network.tx }]} valueFormatter={(v) => `${v} Mb/s`} />
          <KeyValues rows={[["수신", `${O.network.receive_mbps} Mb/s`], ["송신", `${O.network.transmit_mbps} Mb/s`]]} />
        </Panel>
        <Panel padding="sm" enter>
          <CardHead title="디스크" meta={`${O.disks.length} volume`} />
          <div className="kit-dual">
            <Chart kind="radial" fit="fixed" width={110} height={82} aria-label="디스크 읽기" value={disk.read / 100} label={<span className="kit-unit">MiB/s<br />읽기</span>} tone="rx" valueFormatter={() => disk.read.toFixed(1)} />
            <Chart kind="radial" fit="fixed" width={110} height={82} aria-label="디스크 쓰기" value={disk.write / 100} label={<span className="kit-unit">MiB/s<br />쓰기</span>} tone="tx" valueFormatter={() => disk.write.toFixed(1)} />
          </div>
          <BarList aria-label="디스크별 사용량" max={100} thresholds={{ warn: 70, crit: 90 }} valueFormatter={(v) => fmt.pct(v, 1)} items={O.disks.map((d) => ({ name: `${d.device} · ${d.label}`, value: d.usage_percent }))} />
        </Panel>
      </Grid>
      <DataTable aria-label="서비스" header={{ id: "svc", title: "서비스", meta: <span className="bds-mono">방금 갱신</span> }} rows={O.services} rowKey={(r) => r.name}
        columns={[{ key: "name", header: "이름" }, { key: "status", header: "상태", render: (r) => <StatusPill size="sm" tone={r.status === "online" ? "ok" : "crit"}>{r.status === "online" ? "실행 중" : "응답 없음"}</StatusPill> },
          { key: "cpu", header: "CPU", align: "num", hideBelow: "tablet", render: (r) => fmt.pct(r.cpu_percent, 1) }, { key: "mem", header: "메모리", align: "num", hideBelow: "tablet", render: (r) => fmt.bytes(r.memory_bytes) },
          { key: "up", header: "업타임", align: "num", hideBelow: "desktop", render: (r) => fmt.up(r.uptime_seconds) }, { key: "domain", header: "도메인", render: (r) => <span className="bds-mono">{r.domain}</span> }]}
        expandable={(r) => <span className="bds-mono">CPU {fmt.pct(r.cpu_percent, 1)} · 메모리 {fmt.bytes(r.memory_bytes)} · 업타임 {fmt.up(r.uptime_seconds)}</span>} />
      <section className="bds-stack" aria-label="AI 허브 현황">
        <PageHeader title="AI 허브" description="공유 GPU 허브의 예약, 모델 실행과 운영 알림입니다. 자세한 제어는 모델·학습 화면에서 합니다." />
        <AlertBanner tone="warn" title="허브 운영 알림"><b>대기열</b> 1개 작업이 GPU 용량을 기다리고 있습니다. · <b>등록 대기</b> 2개 별도 실행 모델이 실측과 연결을 기다리고 있습니다.</AlertBanner>
        <Grid cols={2}>
          <Panel caption="GPU 메모리 예약" enter>
            <div><StatusPill tone="ok">LocalAI 연결됨</StatusPill></div>
            <div className="bds-metric-grid">
              <StatTile flat label="실제 사용" value={H.capacity.used / 1024} digits={2} unit="GiB" />
              <StatTile flat label="통합 예약" value={H.capacity.reserved / 1024} digits={2} unit="GiB" />
              <StatTile flat label="발급 가능" value={H.capacity.available / 1024} digits={2} unit="GiB" />
              <StatTile flat label="안전 여유" value={H.capacity.headroom / 1024} digits={2} unit="GiB" />
            </div>
            <Chart kind="pie" aria-label="VRAM 예약 구성" height={150} caption="GiB / 24" valueFormatter={(v) => v.toFixed(1)} segments={[{ label: "모델 예약", value: 9.2, tone: "used" }, { label: "학습 예약", value: 6.8, tone: "reserved" }, { label: "발급 가능", value: 6, tone: "free" }, { label: "안전 여유", value: 2, tone: 6 }]} />
          </Panel>
          <Panel caption="모델 요청" enter>
            <p className="kit-copy">전체 요청량, 오류, 평균 응답시간</p>
            <Chart kind="bar" aria-label="최근 모델 요청과 오류" height={170} labels={ticks} xTicks="auto" stacked series={[{ label: "요청", tone: 2, values: H.requests }, { label: "오류", tone: 5, values: H.errors }]} valueFormatter={(v) => `${v}건`} />
            <KeyValues rows={[["요청", "1,891"], ["오류", "45"], ["평균 응답", "184 ms"]]} />
          </Panel>
        </Grid>
        <div className="bds-metric-grid">
          <StatTile icon="cube" label="활성 모델" value={3} unit="개" pill={{ tone: "ok", text: "실행 중" }} spark={[2, 2, 3, 3, 2, 3, 3, 3]} tone={1} detail={<><Tag>ko-embed-v3</Tag><Tag>whisper-large</Tag><Tag>llama-3.1-8b</Tag></>} />
          <StatTile icon="hourglass" label="대기 중 작업" value={1} unit="건" pill={{ tone: "warn", text: "GPU 대기" }} detail={<>ko-rerank · 필요 VRAM <span className="bds-mono">3.2 GiB</span></>} />
          <StatTile icon="stack" label="등록 모델" value={9} unit="개" delta={2} deltaLabel="이번 주" detail={<>LocalAI 6 · ONNX 3</>} />
          <StatTile icon="robot" label="프로세스 자동 제어" value="사용 중" pill={{ tone: "ok", text: "host agent" }} detail={<>heartbeat <span className="bds-mono">4초 전</span> · 자동 시작 2 · 자동 종료 1</>} />
        </div>
        <Panel caption="최근 운영 변화" enter>
          <Timeline aria-label="최근 운영 변화" dense items={H.events.map(([n, s, t]) => ({ id: n + t, time: t.slice(6), title: `${n} ${s}`, tone: s === "실행 중" ? "ok" : s === "종료됨" ? "off" : s === "대기 중" ? "warn" : "info", icon: s === "실행 중" ? "play" : s === "종료됨" ? "stop" : s === "대기 중" ? "hourglass" : "arrow-right" }))} />
        </Panel>
      </section>
    </PageStack>
  );
}
window.MonitoringScreen = MonitoringScreen;
})();
