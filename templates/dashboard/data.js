/* 가상 제품 "봉구 엣지 콘솔"의 목 데이터. 전국 매장에 설치한 엣지 노드(소형 서버 + 안내 단말 +
   결제 리더기)를 원격으로 운영하는 화면을 가정한다. 실제 수집기가 없으므로 값은 고정 시드로 만든다.
   결측(null)은 일부러 섞어 둔다. 이 시스템의 결측 계약을 템플릿에서도 그대로 보여야 한다. */
if (!window.KIT) {
const rnd = (seed) => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const series = (seed, n, base, swing, round = 0) => { const r = rnd(seed); return Array.from({ length: n }, () => Number((base + (r() - 0.5) * swing).toFixed(round))); };

const T = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const NODE = (id, site, region, status, over) => ({
  id, site, region, status, model: "BG-EDGE-2", agent: "2.14.0",
  cpu: 22, mem: 48, disk: 41, temp: 44.5, latency: 38, uptime: 1043400, since: "2025-08-14",
  owner: "정유현", display: "정상", led: "on", ...over,
});

window.KIT = {
  ticks: T,
  fleet: {
    sites: 14, nodes: 38, online: 35, degraded: 2, offline: 1,
    requests: series(11, 24, 1400, 900),
    errors: series(29, 24, 18, 34).map((v) => Math.max(0, v)),
    rx: series(5, 24, 26, 22, 1), tx: series(7, 24, 9, 8, 1),
    // 06:00~07:00 두 칸은 수집기가 멈춰 있던 구간이다. 0이 아니라 결측으로 남긴다.
    p95: [...series(13, 6, 210, 90), null, null, ...series(17, 16, 190, 120)],
    samples: series(23, 160, 180, 260).map((v) => Math.max(24, v)),
    load: [0, 1, 2, 3, 4, 5, 6].map((row) => Array.from({ length: 12 }, (_, col) => {
      if (row === 6 && col > 9) return null;                       // 일요일 야간은 수집 안 됨
      const r = rnd(row * 31 + col * 7)();
      return Math.round((col > 3 && col < 10 ? 60 : 18) * (0.5 + r));
    })),
  },
  days: ["월", "화", "수", "목", "금", "토", "일"],
  hours: Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2, "0")}시`),
  nodes: [
    NODE("edge-seoul-01", "봉구 강남점", "서울", "online", { cpu: 31, mem: 62, temp: 51.5, latency: 24 }),
    NODE("edge-seoul-02", "봉구 합정점", "서울", "online", { cpu: 18, mem: 44, temp: 42, latency: 31 }),
    NODE("edge-seoul-03", "봉구 성수점", "서울", "degraded", { cpu: 74, mem: 88, disk: 91, temp: 68.5, latency: 210, display: "응답 없음" }),
    NODE("edge-gyeonggi-01", "봉구 판교점", "경기", "online", { cpu: 26, mem: 51, temp: 46, latency: 29 }),
    NODE("edge-gyeonggi-02", "봉구 일산점", "경기", "online", { cpu: 12, mem: 33, temp: 39.5, latency: 44, agent: "2.13.2" }),
    NODE("edge-busan-01", "봉구 서면점", "부산", "online", { cpu: 35, mem: 57, temp: 53, latency: 62 }),
    NODE("edge-busan-02", "봉구 해운대점", "부산", "degraded", { cpu: 58, mem: 71, temp: 63, latency: 340, agent: "2.13.2", led: "off" }),
    NODE("edge-daegu-01", "봉구 동성로점", "대구", "online", { cpu: 21, mem: 46, temp: 44, latency: 58 }),
    NODE("edge-gwangju-01", "봉구 충장로점", "광주", "online", { cpu: 17, mem: 39, temp: 41, latency: 71 }),
    // 회선이 끊긴 노드. 지표를 0으로 꾸미지 않고 결측 그대로 둔다.
    NODE("edge-daejeon-01", "봉구 둔산점", "대전", "offline", { cpu: null, mem: null, disk: null, temp: null, latency: null, uptime: null, display: null, led: null, owner: "김서준" }),
    NODE("edge-daejeon-02", "봉구 유성점", "대전", "online", { cpu: 24, mem: 49, temp: 45.5, latency: 66, owner: "김서준" }),
    NODE("edge-seoul-04", "봉구 여의도점", "서울", "online", { cpu: 29, mem: 55, temp: 48, latency: 27, owner: "박하늘" }),
  ],
  services: [
    { name: "edge-gateway", label: "엣지 게이트웨이", tone: "ok", text: "정상", latency: 42 },
    { name: "config-api", label: "설정 API", tone: "ok", text: "정상", latency: 61 },
    { name: "telemetry", label: "수집 파이프라인", tone: "warn", text: "일부 수집 지연", latency: 480 },
    { name: "artifact-cdn", label: "배포 저장소", tone: "ok", text: "정상", latency: 88 },
    { name: "device-api", label: "장치 제어 API", tone: "ok", text: "정상", latency: null },
  ],
  /* 90칸 = 최근 90일. off는 아직 노드를 설치하기 전이라 가용성 분모에서 빠진다. */
  uptime: (seed, bad) => Array.from({ length: 90 }, (_, i) => {
    if (seed === 3 && i < 6) return { status: "off", label: "설치 전" };
    const r = rnd(seed * 17 + i)();
    if (bad && (i === 84 || i === 85 || i === 89)) return { status: "crit", label: "연결 끊김" };
    return { status: r < 0.06 ? "warn" : "ok", label: r < 0.06 ? "수집 지연" : "정상" };
  }),
  events: [
    ["18:42", "edge-seoul-03 수집 지연", "메모리 88%. 에이전트가 표본을 건너뛰고 있습니다.", "warn", "warning"],
    ["18:20", "v2.14.0 배포 완료", "서울·경기 12대에 반영했습니다.", "ok", "check"],
    ["17:55", "edge-daejeon-01 연결 끊김", "회선 점검 요청을 접수했습니다.", "crit", "plugs"],
    ["16:30", "장치 운영 모드 변경", "서울 8개 지점을 무인 모드로 바꿨습니다.", "info", "sliders"],
    ["09:10", "정기 점검 창 종료", "예약된 재시작 6건이 끝났습니다.", "ok", "wrench"],
  ],
  alarms: [
    { id: "a1", title: "edge-seoul-03 메모리 88%", description: "임계 85%를 넘었습니다. 재시작 예약을 검토합니다.", tone: "warn", time: "18:42", read: false },
    { id: "a2", title: "edge-daejeon-01 연결 끊김", description: "17:55부터 heartbeat가 없습니다.", tone: "crit", time: "17:55", read: false },
    { id: "a3", title: "v2.14.0 배포 완료", description: "서울·경기 12대 반영", tone: "ok", time: "18:20", read: false },
    { id: "a4", title: "수집 파이프라인 지연", description: "p95가 480 ms입니다.", tone: "warn", time: "16:02", read: true },
    { id: "a5", title: "정기 점검 창 종료", description: "재시작 6건 완료", tone: "info", time: "09:10", read: true },
  ],
  operators: [
    { id: "u1", name: "정유현", email: "youhyun@bonggu.me", role: "owner", roleText: "소유자", regions: ["서울", "경기"], mfa: true, last: "2026-09-09 18:41", status: "ok" },
    { id: "u2", name: "김서준", email: "seojun@bonggu.me", role: "operator", roleText: "운영자", regions: ["대전"], mfa: true, last: "2026-09-09 14:02", status: "ok" },
    { id: "u3", name: "박하늘", email: "haneul@bonggu.me", role: "operator", roleText: "운영자", regions: ["서울"], mfa: false, last: "2026-09-08 20:15", status: "warn" },
    { id: "u4", name: "이도윤", email: "doyun@bonggu.me", role: "viewer", roleText: "조회자", regions: ["부산", "대구"], mfa: true, last: "2026-09-05 09:33", status: "ok" },
    { id: "u5", name: "최민서", email: "minseo@partner.co.kr", role: "viewer", roleText: "조회자", regions: [], mfa: false, last: null, status: "off" },
  ],
  releases: [
    { value: "2.15.0-rc1", label: "2.15.0-rc1 · 후보", detail: "오프라인 캐시 재작성" },
    { value: "2.14.0", label: "2.14.0 · 안정", detail: "장치 제어 API 교체" },
    { value: "2.13.2", label: "2.13.2 · 안정", detail: "수집 주기 보정" },
    { value: "2.12.4", label: "2.12.4 · 안정", detail: "LED 밝기 스케줄" },
    { value: "2.11.0", label: "2.11.0 · 안정", detail: "초기 롤아웃 배치" },
    { value: "2.10.1", label: "2.10.1 · 지원 종료", detail: "보안 패치만 제공", disabled: true },
  ],
  manifest: '{\n  "agent": "2.15.0-rc1",\n  "rollout": { "batch": 6, "pause_on_error": true },\n  "devices": { "profile": "store-default", "refresh_seconds": 30 },\n  "telemetry": { "interval_seconds": 5, "keep_days": 30 }\n}',
  diff: [
    { field: "agent", from: "2.14.0", to: "2.15.0-rc1" },
    { field: "rollout.batch", from: 4, to: 6 },
    { field: "devices.profile", from: "store-legacy", to: "store-default" },
    { field: "telemetry.interval_seconds", from: 10, to: 5 },
    { field: "cache.offline_mb", to: 512, kind: "added" },
    { field: "legacy.ftp_sync", from: "true", kind: "removed" },
  ],
  logs: [
    { level: "info", time: "18:40:02", text: "rollout batch 3/6 시작 edge-busan-01 edge-busan-02" },
    { level: "ok", time: "18:40:31", text: "edge-busan-01 agent 2.15.0-rc1 반영" },
    { level: "warn", time: "18:41:04", text: "edge-busan-02 응답 지연 340 ms · 재시도 1회" },
    { level: "ok", time: "18:41:38", text: "edge-busan-02 agent 2.15.0-rc1 반영" },
    { level: "error", time: "18:42:10", text: "edge-seoul-03 verify 실패 · 메모리 부족" },
    { level: "info", time: "18:42:11", text: "pause_on_error=true · 롤아웃을 멈췄습니다" },
    { level: "debug", time: "18:42:12", text: "state=paused batch=4 remaining=14" },
  ],
  fmt: {
    pct: (v, d = 0) => (v == null ? "수집 안 됨" : `${v.toFixed(d)}%`),
    temp: (v) => (v == null ? "수집 안 됨" : `${v.toFixed(1)}°C`),
    ms: (v) => (v == null ? "수집 안 됨" : `${Math.round(v)} ms`),
    up: (s) => { if (s == null) return "수집 안 됨"; const m = Math.floor(s / 60); return `${Math.floor(m / 1440)}d ${String(Math.floor((m % 1440) / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; },
    mbps: (v) => (v == null ? "수집 안 됨" : `${v.toFixed(1)} Mb/s`),
  },
};
}
/* 화면 모듈을 렌더 없이 로드하기 위한 빈 컴포넌트 */
window.KitNoop = window.KitNoop || (() => null);
/* 번들이 비동기로 로드되므로 화면 모듈은 window.Ds_d3ea90를 직접 읽지 않고 이 프록시를 구조분해한다.
   각 키는 렌더 시점에 실제 컴포넌트로 위임하는 얇은 래퍼라 로드 순서에 의존하지 않는다. */
window.DS = new Proxy({}, { get(_, name) {
  if (name === "ToastProvider") { const P = (props) => { const C = window.Ds_d3ea90?.ToastProvider; return C ? window.React.createElement(C, props) : null; }; P.useToast = (...a) => window.Ds_d3ea90.ToastProvider.useToast(...a); return P; }
  const W = (props) => { const C = window.Ds_d3ea90?.[name]; return C ? window.React.createElement(C, props) : null; };
  W.displayName = String(name); return W;
} });
