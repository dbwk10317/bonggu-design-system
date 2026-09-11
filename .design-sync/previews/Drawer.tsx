import * as React from "react";
import { Drawer, Button, Stack, Inline, KeyValues, StatusPill, Tabs, Sparkline, CardHead, Panel } from "@dbwk10317/bonggu-design-system";

const cpu = [31, 34, 30, 42, 58, 51, 47, 63, 71, 66, 59, 62, 78, 74, 69];

/* 목록 맥락을 유지한 채 한 항목의 상세를 본다. 삭제·저장 같은 결정은 Modal 이다. */
export const NodeDetail = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>상세 열기</Button>
      <Drawer
        open={open} onClose={() => setOpen(false)} size="md"
        title="edge-seoul-03"
        description="봉구 성수점 · BG-EDGE-2"
        actions={<Inline gap={2}><Button variant="secondary">설정 다시 읽기</Button><Button variant="danger">격리</Button></Inline>}
      >
        <Stack gap={4}>
          <Inline gap={2}><StatusPill tone="crit" pulse>응답 없음</StatusPill><StatusPill tone="off">22분 전</StatusPill></Inline>
          <KeyValues lined rows={[
            { k: "에이전트", v: "2.14.0", mono: true },
            { k: "CPU", v: "74%", mono: true },
            { k: "메모리", v: "88%", mono: true },
            { k: "디스크", v: "91%", mono: true },
          ]} />
          <Panel padding="sm">
            <CardHead title="CPU" meta="최근 15분" />
            <div style={{ height: 48 }}><Sparkline values={cpu} tone={5} area /></div>
          </Panel>
        </Stack>
      </Drawer>
    </>
  );
};

/* 탭을 넣어 한 항목의 여러 면을 한 자리에서 본다. */
export const WithTabs = () => {
  const [open, setOpen] = React.useState(true);
  const [tab, setTab] = React.useState("summary");
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>탭이 있는 드로어</Button>
      <Drawer open={open} onClose={() => setOpen(false)} size="lg" title="edge-busan-02" closeButton>
        <Stack gap={4}>
          <Tabs
            value={tab} onChange={setTab}
            items={[{ value: "summary", label: "요약" }, { value: "logs", label: "로그" }, { value: "config", label: "설정" }]}
          />
          {tab === "summary" && <p>지연이 340ms 까지 올랐습니다.</p>}
          {tab === "logs" && <p className="bds-mono">13:40:11 agent: heartbeat timeout</p>}
          {tab === "config" && <p>수집 주기 5초 · 배치 8대</p>}
        </Stack>
      </Drawer>
    </>
  );
};

/* 좁은 보조 정보는 sm. 표나 코드가 들어가면 lg. */
export const Sizes = () => {
  const [size, setSize] = React.useState<"sm" | "md" | "lg" | null>("sm");
  return (
    <>
      <Inline gap={2}>
        {(["sm", "md", "lg"] as const).map((s) => <Button key={s} variant="secondary" size="sm" onClick={() => setSize(s)}>{s}</Button>)}
      </Inline>
      <Drawer open={size !== null} onClose={() => setSize(null)} size={size ?? "sm"} title={`size="${size}"`} closeButton>
        <p>sm 380 · md 480 · lg 640</p>
      </Drawer>
    </>
  );
};
