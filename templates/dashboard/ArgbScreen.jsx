(() => {
const { PageStack, PageHeader, Panel, StatusPill, Tag, MascotMark, Switch, Field, Select, SegmentedControl, Button, IconButton, Modal, ToastProvider, Grid } = window.DS;
const useToast = ToastProvider.useToast;

const EFFECTS = [{ value: "static", label: "고정" }, { value: "breathing", label: "숨쉬기" }, { value: "rainbow", label: "레인보우" }, { value: "wave", label: "웨이브" }, { value: "off", label: "꺼짐" }];
const PRESETS = ["#F0A35A", "#5CA8FF", "#46B36B", "#B388FF", "#F2554D", "#22D3EE", "#FFFFFF"];

function LedRing({ colors, effect, count = 12 }) {
  return (
    <div className="kit-led" aria-hidden="true" data-effect={effect}>
      {Array.from({ length: count }, (_, i) => <i key={i} style={{ "--c": colors[i % colors.length], "--i": i, transform: `rotate(${(360 / count) * i}deg) translateY(-42px)` }} />)}
    </div>
  );
}

function ArgbScreen() {
  const { toast } = useToast();
  const [sync, setSync] = React.useState(true);
  const [target, setTarget] = React.useState("motherboard");
  const [effect, setEffect] = React.useState("breathing");
  const [colors, setColors] = React.useState(["#F0A35A", "#5CA8FF"]);
  const [speed, setSpeed] = React.useState("medium");
  const [bright, setBright] = React.useState("3");
  const [active, setActive] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const apply = () => { setBusy(true); setTimeout(() => { setBusy(false); if (effect === "wave" && !sync) setErr({ title: "명령이 처리되지 않았습니다", detail: "gpu: 데몬이 wave 효과를 지원하지 않습니다." }); else toast({ message: sync ? "두 장치에 적용했습니다." : `${target === "motherboard" ? "메인보드" : "그래픽카드"}에 적용했습니다.`, tone: "ok" }); }, 700); };
  const devices = [["motherboard", "메인보드", "argb-board-0"], ["gpu", "그래픽카드", "argb-gpu-0"]];
  return (
    <>
      <PageStack aria-label="조명 제어">
        <PageHeader title="조명" description="쿨러와 그래픽카드 조명을 효과·색·밝기로 제어합니다. 적용하면 bonggu-argb 데몬이 하드웨어에 즉시 반영합니다." actions={<><MascotMark face="smiling" animated={false} /><StatusPill tone="ok">데몬 온라인</StatusPill></>} />
        <Grid cols={2}>
          {devices.map(([id, label, dev]) => {
            const selected = sync || target === id;
            return (
              <Panel key={id} padding="sm" interactive selected={selected} onClick={() => setTarget(id)} role="button" aria-pressed={selected} aria-label={`${label} 선택`}>
                <div className="kit-prevhead"><b>{label}</b><span className="bds-mono kit-dim">{dev}</span>{selected && <Tag accent>선택됨</Tag>}<StatusPill tone="ok" size="sm">사용 가능</StatusPill></div>
                <div className="kit-stage"><LedRing colors={colors} effect={effect} count={id === "gpu" ? 8 : 12} /></div>
                <div className="kit-dim bds-mono" style={{ fontSize: 11 }}>적용: 점등 · {EFFECTS.find((e) => e.value === effect)?.label} · {colors.join(" ")} · 밝기 {bright}</div>
              </Panel>
            );
          })}
        </Grid>
        <Panel padding="sm" aria-label="조명 제어부">
          <div className="kit-ctlhead"><b>제어</b><Switch checked={sync} onChange={(e) => setSync(e.target.checked)}>같이 설정</Switch><span className="kit-dim">{sync ? "한 제어부가 두 장치를 함께 바꿉니다" : "선택한 장치만 바꿉니다"}</span></div>
          <div className="kit-fields">
            <Field label={<>효과 <span className="kit-dim">{sync ? "두 장치 공통" : "선택 장치"} {EFFECTS.length}종</span></>}><Select fit="fixed" width={260} value={effect} onChange={(e) => setEffect(e.target.value)} options={EFFECTS} /></Field>
            <div className="bds-field"><span className="bds-field__label">색 <span className="bds-mono kit-dim">{colors.length}/4</span></span>
              <div className="kit-colors">
                {colors.map((c, i) => <span key={i} className={"kit-chip" + (i === active ? " on" : "")}><input type="color" value={c} aria-label={`색 ${i + 1}`} onClick={() => setActive(i)} onChange={(e) => setColors(colors.map((x, j) => (j === i ? e.target.value : x)))} /><button type="button" className="bds-mono" onClick={() => setActive(i)}>{c.toUpperCase()}</button>{colors.length > 1 && <IconButton size="sm" variant="danger" icon="x" aria-label={`색 ${i + 1} 제거`} onClick={() => setColors(colors.filter((_, j) => j !== i))} />}</span>)}
                {colors.length < 4 && <Button size="sm" variant="ghost" icon="plus" onClick={() => setColors([...colors, colors[active]])}>색 추가</Button>}
              </div>
              <div className="kit-presets" role="group" aria-label="색 프리셋">{PRESETS.map((p) => <button key={p} type="button" style={{ background: p }} aria-label={`색 ${p} 적용`} onClick={() => setColors(colors.map((x, j) => (j === active ? p : x)))} />)}</div>
            </div>
            <div className="bds-field"><span className="bds-field__label">속도</span><SegmentedControl aria-label="속도" value={speed} onChange={setSpeed} options={[{ value: "slow", label: "느리게" }, { value: "medium", label: "보통" }, { value: "fast", label: "빠르게" }]} /></div>
            <div className="bds-field"><span className="bds-field__label">밝기</span><SegmentedControl aria-label="밝기" value={bright} onChange={setBright} options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: n }))} /></div>
          </div>
          <div className="kit-bottom">
            <p className="kit-dim" style={{ maxWidth: "46em" }}>{sync ? "미리보기 카드 두 개가 함께 선택됩니다. 적용하면 두 장치에 즉시 함께 반영됩니다." : "미리보기 카드를 누르면 적용 대상으로 선택됩니다. 선택한 카드의 장치에만 즉시 반영됩니다."}</p>
            <div className="kit-actions"><Button variant="secondary">켜기</Button><Button variant="secondary">소등</Button><Button variant="primary" busy={busy} onClick={apply}>적용</Button></div>
          </div>
        </Panel>
      </PageStack>
      <Modal open={!!err} onClose={() => setErr(null)} title={err?.title} description={err?.detail} size="sm" actions={<Button variant="primary" onClick={() => setErr(null)}>확인</Button>} />
    </>
  );
}
window.ArgbScreen = ArgbScreen;
})();
