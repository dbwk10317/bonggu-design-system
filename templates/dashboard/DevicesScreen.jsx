(() => {
const { PageStack, PageHeader, Panel, Grid, Stack, Inline, Spacer, Divider, AspectRatio, Field, TextField, Select, SegmentedControl, RadioGroup, Switch, Checkbox, Slider, NumberStepper, ColorInput, TimePicker, Dropzone, Chart, KeyValues, StatusPill, Tag, MascotMark, Button, IconButton, Tooltip, Modal, InlineMessage, EmptyState, ToastProvider } = window.DS;
const useToast = ToastProvider.useToast;

const IDLE = [{ value: "on", label: "항상 켜기" }, { value: "sleep", label: "자동 절전" }, { value: "schedule", label: "일정 따름" }, { value: "off", label: "끄기" }];
const LABEL_COLORS = ["#F0A35A", "#5CA8FF", "#46B36B", "#B388FF", "#F2554D", "#22D3EE"];
const MODES = [
  { value: "normal", label: "일반 운영", hint: "손님이 쓰는 기본 상태입니다." },
  { value: "maintenance", label: "점검", hint: "점검 안내만 띄우고 입력을 받지 않습니다." },
  { value: "unattended", label: "무인", hint: "직원 호출 없이 결제까지 스스로 끝냅니다." },
  { value: "stopped", label: "정지", hint: "전원을 내립니다. 복구는 현장에서만 됩니다.", disabled: true },
];
const DEVICES = [
  { id: "kiosk", label: "안내 단말", dev: "kiosk-0", model: "BG-KIOSK-2", fw: "1.8.4", tone: "ok", text: "정상", temp: 0.42, tempText: "42.0°C" },
  { id: "reader", label: "결제 리더기", dev: "reader-0", model: "BG-PAY-1", fw: "1.6.0", tone: "warn", text: "응답 지연", temp: 0.58, tempText: "58.0°C" },
];

function DevicesScreen() {
  const { toast } = useToast();
  const [sync, setSync] = React.useState(true);
  const [target, setTarget] = React.useState("kiosk");
  const [mode, setMode] = React.useState("normal");
  const [idle, setIdle] = React.useState("schedule");
  const [color, setColor] = React.useState("#5CA8FF");
  const [bright, setBright] = React.useState(3);
  const [refresh, setRefresh] = React.useState(30);
  const [onAt, setOnAt] = React.useState("08:00");
  const [offAt, setOffAt] = React.useState("23:30");
  const [holiday, setHoliday] = React.useState(true);
  const [zone, setZone] = React.useState("store");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [photos, setPhotos] = React.useState([]);
  const picked = DEVICES.find((d) => d.id === target) ?? DEVICES[0];

  const apply = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (mode === "unattended" && !sync) setErr({ title: "명령이 처리되지 않았습니다", detail: "결제 리더기가 무인 모드를 지원하지 않습니다. 펌웨어 1.7 이상이 필요합니다." });
      else toast({ message: sync ? "두 장치에 적용했습니다." : `${picked.label}에 적용했습니다.`, tone: "ok", action: "되돌리기", onAction: () => toast({ message: "직전 설정으로 되돌렸습니다.", tone: "info" }) });
    }, 700);
  };

  return (
    <PageStack aria-label="장치 제어">
      <PageHeader title="장치" description="노드에 연결된 주변 장치의 운영 모드와 일정을 원격으로 바꿉니다. 적용하면 게이트웨이가 해당 지점 노드에 즉시 내려보냅니다."
        actions={<><MascotMark face="smiling" animated={false} /><StatusPill tone="ok">게이트웨이 온라인</StatusPill></>} />

      <Grid cols={2}>
        {DEVICES.map((d) => {
          const selected = sync || target === d.id;
          return (
            <Panel key={d.id} as="button" padding="sm" interactive selected={selected} onClick={() => setTarget(d.id)} aria-pressed={selected} aria-label={`${d.label} 선택`}>
              <div className="kit-prevhead"><b>{d.label}</b><span className="bds-mono kit-dim">{d.dev}</span>{selected && <Tag accent>선택됨</Tag>}<StatusPill tone={d.tone} size="sm">{d.text}</StatusPill></div>
              <div className="kit-row2">
                <Chart kind="radial" fit="fixed" width={116} height={88} aria-label={`${d.label} 온도`} value={d.temp} label="장치 온도" tone={d.tone === "warn" ? "warn" : "ok"} valueFormatter={() => d.tempText} />
                <KeyValues rows={[["모델", d.model], ["펌웨어", d.fw], ["운영 시간", `${onAt}~${offAt}`]]} />
              </div>
              <div className="kit-dim bds-mono">{MODES.find((m) => m.value === mode)?.label} · 밝기 {bright} · 갱신 {refresh}초</div>
            </Panel>
          );
        })}
      </Grid>

      <Panel padding="sm" aria-label="장치 제어부">
        <div className="kit-ctlhead">
          <b>제어</b>
          <Switch checked={sync} onChange={(e) => setSync(e.target.checked)}>두 장치를 같이 설정</Switch>
          <Spacer />
          <Tooltip content="현장에서 직접 조작한 값을 다시 읽어옵니다"><IconButton icon="arrows-clockwise" variant="ghost" size="sm" aria-label="장치 상태 다시 읽기" onClick={() => toast({ message: "장치 상태를 다시 읽었습니다.", tone: "ok" })} /></Tooltip>
        </div>
        {!sync && <InlineMessage tone="warn" icon="warning">지금은 <b>{picked.label}</b>에만 적용됩니다.</InlineMessage>}

        <div className="kit-fields">
          <Field label="운영 모드" hint="적용하면 다음 갱신 주기에 반영됩니다.">
            <RadioGroup layout="cards" value={mode} onChange={setMode} options={MODES} />
          </Field>
          <Grid cols={2}>
            <Field label="대기 화면"><SegmentedControl aria-label="대기 화면 동작" fit="flex" value={idle} onChange={setIdle} options={IDLE} /></Field>
            <Field label="설치 구역" hint="같은 구역의 장치가 함께 켜지고 꺼집니다.">
              <Select aria-label="설치 구역" value={zone} onChange={(e) => setZone(e.target.value)} options={[{ value: "store", label: "매장 내부" }, { value: "counter", label: "계산대" }, { value: "entrance", label: "출입구" }]} />
            </Field>
          </Grid>
          <Grid cols={2}>
            <Field label="라벨 색" hint="목록과 차트에서 이 장치 묶음을 가리키는 색입니다.">
              <ColorInput aria-label="장치 라벨 색" value={color} onChange={setColor} presets={LABEL_COLORS} />
            </Field>
            <Field label="화면 밝기"><Slider min={1} max={5} step={1} value={bright} onChange={setBright} marks={[{ value: 1, label: "어둡게" }, { value: 3, label: "보통" }, { value: 5, label: "밝게" }]} showValue /></Field>
          </Grid>
          <Grid cols={3}>
            <Field label="화면 갱신 주기"><NumberStepper value={refresh} min={5} max={600} step={5} unit="초" onChange={setRefresh} /></Field>
            <Field label="운영 시작"><TimePicker value={onAt} onChange={setOnAt} step={30} /></Field>
            <Field label="운영 종료"><TimePicker value={offAt} onChange={setOffAt} step={30} /></Field>
          </Grid>
          <Field label="휴무일" hint="지점 휴무일에는 일정을 건너뜁니다.">
            <Checkbox checked={holiday} onChange={(e) => setHoliday(e.target.checked)}>휴무일에는 켜지 않기</Checkbox>
          </Field>
          <Field label="지점에 남길 메모"><TextField placeholder="현장 담당자가 볼 한 줄" maxLength={60} /></Field>
        </div>

        <div className="kit-bottom">
          <Inline gap={3} align="center">
            <Stack gap={1}>
              <span className="kit-dim">마지막 적용</span>
              <b className="bds-mono">18:30:12</b>
            </Stack>
          </Inline>
          <div className="kit-actions">
            <Button variant="secondary" onClick={() => toast({ message: "직전 설정으로 되돌렸습니다.", tone: "info" })}>되돌리기</Button>
            <Button variant="primary" busy={busy} onClick={apply}>적용</Button>
          </div>
        </div>
      </Panel>

      <Panel padding="sm">
        <div className="kit-prevhead"><b>설치 현장 사진</b><span className="kit-dim">올리면 4:3으로 잘라 1280×960으로 변환합니다.</span></div>
        <Dropzone accept="image/*" multiple icon="image" onFiles={(files) => setPhotos(files.map((f) => f.name))} title="사진을 끌어다 놓습니다" hint="JPG·PNG · 한 장에 10 MB까지" />
        <Divider />
        {photos.length === 0
          ? <EmptyState plain face="curious" title="아직 올린 사진이 없습니다" description="설치 위치와 배선을 찍어 두면 현장 점검을 나갈 때 바로 확인할 수 있습니다." />
          : <Grid min={160}>{photos.map((name) => <AspectRatio key={name} ratio="4/3" className="kit-photo"><span className="bds-mono">{name}</span></AspectRatio>)}</Grid>}
      </Panel>

      <Modal open={!!err} onClose={() => setErr(null)} size="sm" title={err?.title} actions={<Button variant="primary" onClick={() => setErr(null)}>확인</Button>}>
        <Stack gap={2}>
          <p>{err?.detail}</p>
          <p className="kit-dim">모드를 일반이나 점검으로 바꾸거나, 두 장치를 같이 설정으로 두고 다시 적용합니다.</p>
        </Stack>
      </Modal>
    </PageStack>
  );
}
window.DevicesScreen = DevicesScreen;
})();
