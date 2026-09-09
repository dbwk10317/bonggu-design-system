if (!window.KIT) {
/* 목 데이터. 제품 실제 데이터 모양(dashboard/frontend/src/types.ts Overview)을 따른다. */
const T = Array.from({ length: 24 }, (_, i) => `${String(Math.floor(i / 2) + 7).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
window.KIT = {
  ticks: T,
  overview: {
    status: "online", host: { name: "bonggu", uptime_seconds: 1052460 }, poll_interval_seconds: 1,
    cpu: { model: "Ryzen 9 7950X", usage_percent: 24.3, temperature_c: 58.5, load_1m: 2.41, running_processes: 412 },
    memory: { usage_percent: 61.8, used_bytes: 39.6e9, total_bytes: 64e9, cached_bytes: 12.1e9, swap_used_bytes: 0 },
    gpu: { model: "RTX 4090", usage_percent: 8, vram_used_bytes: 13.3e9, vram_total_bytes: 24e9, temperature_c: 41, power_watts: 68 },
    motherboard: { temperature_c: 44, pump_rpm: 2140, radiator_fan_rpm: 980, case_fan_rpm: 760 },
    network: { interface: "enp129s0", receive_mbps: 31.4, transmit_mbps: 8.2, rx: [12, 18, 15, 22, 19, 25, 31, 28, 26, 35, 40, 38, 33, 29, 27, 30, 36, 41, 39, 34, 31, 28, 30, 31], tx: [4, 6, 5, 8, 7, 9, 10, 8, 12, 11, 9, 13, 10, 8, 7, 9, 11, 12, 10, 9, 8, 7, 8, 8] },
    disks: [{ device: "nvme0n1", label: "시스템", usage_percent: 63.2, used_bytes: 1.21e12, total_bytes: 1.92e12, temperature_c: 38, read: 12.4, write: 3.1 }, { device: "sda", label: "미디어", usage_percent: 91.4, used_bytes: 7.3e12, total_bytes: 8e12, temperature_c: 34, read: 0.8, write: 0.2 }, { device: "sdb", label: "백업", usage_percent: null, used_bytes: null, total_bytes: null, temperature_c: null, read: null, write: null }],
    services: [
      { name: "ai-hub", status: "online", latency_ms: 42, cpu_percent: 3.2, memory_bytes: 1.5e9, uptime_seconds: 1052000, domain: "ai.bonggu.me" },
      { name: "postgres-shared", status: "online", latency_ms: 3, cpu_percent: 0.8, memory_bytes: 6.4e8, uptime_seconds: 2712000, domain: "내부" },
      { name: "grafana", status: "online", latency_ms: 88, cpu_percent: 1.1, memory_bytes: 3.2e8, uptime_seconds: 1052000, domain: "grafana.bonggu.me" },
      { name: "galpi", status: "online", latency_ms: 120, cpu_percent: 0.4, memory_bytes: 2.1e8, uptime_seconds: 431000, domain: "galpi.bonggu.me" },
      { name: "monitoring-api", status: "offline", latency_ms: null, cpu_percent: null, memory_bytes: null, uptime_seconds: null, domain: "내부" },
    ],
    power: { watts: 148 },
  },
  hub: {
    capacity: { total: 24576, used: 13620, reserved: 16384, available: 6144, headroom: 2048 },
    requests: [40, 52, 38, 61, 70, 55, 63, 72, 80, 76, 69, 74, 88, 92, 85, 79, 83, 90, 95, 101, 97, 88, 84, 91],
    errors: [2, 1, 4, 0, 3, 2, 1, 5, 2, 1, 0, 2, 3, 1, 2, 4, 1, 0, 2, 3, 2, 1, 1, 2],
    events: [["ko-embed-v3", "실행 중", "09-08 18:40:12"], ["whisper-large", "종료됨", "09-08 17:02:44"], ["llama-3.1-8b", "실행 준비", "09-08 16:51:03"], ["ko-rerank", "대기 중", "09-08 16:49:58"]],
  },
  alarms: [
    { id: "a1", tone: "crit", title: "monitoring-api 응답 없음", description: "3회 연속 실패", time: "18:41", read: false },
    { id: "a2", tone: "warn", title: "sda 사용률 91.4%", description: "위험 임계 90%", time: "18:12", read: false },
    { id: "a3", tone: "info", title: "모니터링 수집 지연", description: "12초 지연", time: "17:58", read: true, resolved: true },
  ],
  users: [
    { id: "u1", name: "서연호", email: "yeonho@bonggu.me", roles: ["admin"], state: "활성", last: "09-08 18:30" },
    { id: "u2", name: "김민재", email: "minjae@bonggu.me", roles: ["viewer", "argb"], state: "활성", last: "09-07 22:11" },
    { id: "u3", name: "monitoring-bot", email: "bot@bonggu.me", roles: ["viewer"], state: "잠김", last: "08-30 09:02" },
    { id: "u4", name: "이수아", email: "sua@bonggu.me", roles: ["hub-operator"], state: "활성", last: "09-08 11:47" },
  ],
  roles: [["admin", "모든 화면과 관리 작업", 1], ["hub-operator", "AI 허브 모델·학습 제어", 1], ["argb", "조명·쿨러 제어", 1], ["viewer", "모니터링 읽기", 3]],
  /* 통합 모델 목록. label/tone/detail은 hubModels.ts monitorState() 결과 모양 */
  models: [
    { id: "ko-embed-v3", name: "ko-embed-v3", runtime: "localai", active: true, state: "active", label: "준비됨", tone: "ok", detail: "요청 처리 가능", pinned: true, vram_mib: 3072, capabilities: ["embedding"], share: 0.55, p95: 38, description: "한국어 문장 임베딩. RAG 검색 기본 모델" },
    { id: "whisper-large-v3", name: "whisper-large", runtime: "localai", active: true, state: "active", label: "사용 중", tone: "info", detail: "추론 요청 처리 중", pinned: false, vram_mib: 4096, capabilities: ["audio", "transcribe"], share: 0.2, p95: 1840, description: "음성 → 텍스트. galpi 녹취에 사용" },
    { id: "llama-3.1-8b-q5", name: "llama-3.1-8b", runtime: "localai", active: true, state: "active", label: "준비됨", tone: "ok", detail: "요청 처리 가능", pinned: false, vram_mib: 6144, capabilities: ["chat", "completion"], share: 0.2, p95: 412, description: "범용 대화 모델. 5-bit 양자화" },
    { id: "ko-rerank", name: "ko-rerank", runtime: "custom-worker", active: false, state: "queued", label: "검증 중", tone: "info", detail: "Triton load와 readiness 확인 중", pinned: false, vram_mib: 3277, capabilities: ["rerank"], share: 0, p95: 0, description: "검색 결과 재정렬 ONNX 모델" },
    { id: "yolo-v8m", name: "yolo-v8m", runtime: "custom-worker", active: false, state: "idle", label: "미활성", tone: "off", detail: "활성화 시 GPU 예약", pinned: false, vram_mib: 1536, capabilities: ["vision", "detect"], share: 0.05, p95: 22, description: "객체 탐지. CCTV 스냅샷 분석" },
    { id: "sd-turbo", name: "sd-turbo", runtime: "localai", active: false, state: "idle", label: "미적재", tone: "off", detail: "요청 시 콜드 로드", pinned: false, vram_mib: 5120, capabilities: ["image"], share: 0, p95: 0, description: "이미지 생성. 요청 시에만 로드" },
    { id: "ko-ner-bert", name: "ko-ner-bert", runtime: "custom-worker", active: false, state: "failed", label: "검증 실패", tone: "crit", detail: "smoke 추론 실패 · 입력 텐서 shape 불일치", pinned: false, vram_mib: 1024, capabilities: ["ner"], share: 0, p95: 0, description: "개체명 인식 ONNX 모델" },
    { id: "bge-m3", name: "bge-m3", runtime: "localai", active: false, state: "idle", label: "미적재", tone: "off", detail: "요청 시 콜드 로드", pinned: false, vram_mib: 2304, capabilities: ["embedding"], share: 0, p95: 0, description: "다국어 임베딩" },
    { id: "kokoro-tts", name: "kokoro-tts", runtime: "localai", active: false, state: "idle", label: "미적재", tone: "off", detail: "요청 시 콜드 로드", pinned: false, vram_mib: 1024, capabilities: ["tts"], share: 0, p95: 0, description: "음성 합성" },
  ],
  training: {
    projects: [
      { id: "prj_ko-embed", name: "ko-embed 파인튠", owner: "yeonho", rev: { id: "rev_0913", version: "1.4.0", status: "available" }, prev: { id: "rev_0827", version: "1.3.2" }, updated: "09-08 16:20", recipes: ["finetune", "eval"], format: "jsonl/v1", changed: [["prefect.recipes.finetune.epochs", "12 → 20"], ["dataset.schema.fields.label_weight", "+ float"], ["image_digest", "sha256:3f1c… → sha256:9a2e…"]] },
      { id: "prj_ocr", name: "영수증 OCR", owner: "sua", rev: { id: "rev_0907", version: "0.9.1", status: "awaiting_approval" }, prev: { id: "rev_0901", version: "0.9.0" }, updated: "09-07 22:41", recipes: ["finetune"], format: "coco/v2", changed: [["prefect.recipes.finetune.lr", "1e-4 → 5e-5"]] },
      { id: "prj_asr-ko", name: "한국어 ASR 적응", owner: "minjae", rev: { id: "rev_0815", version: "2.1.0", status: "available" }, prev: null, updated: "08-15 10:02", recipes: ["adapt", "eval"], format: "audio-manifest/v1", changed: [] },
      { id: "prj_ner", name: "개체명 인식", owner: "yeonho", rev: { id: "rev_0620", version: "1.0.0", status: "deprecated" }, prev: null, updated: "06-20 09:15", recipes: ["finetune"], format: "conll/v1", changed: [] },
    ],
    datasets: [{ id: "ds_0902", name: "ko-pairs-2026-09" }, { id: "ds_0818", name: "ko-pairs-2026-08" }],
    runs: [
      { id: "run-0913-a", project: "ko-embed 파인튠", recipe: "finetune", status: "running", detail: "epoch 12/20", stage: "train", stageStatus: "running", priority: "standard", vram: 6963, updated: "09-08 18:42", revision: "rev_0913", dataset: "ds_0902", result: "확인 중" },
      { id: "run-0913-b", project: "한국어 ASR 적응", recipe: "adapt", status: "queued", detail: "GPU admission 대기", stage: null, priority: "bulk", vram: 6144, updated: "09-08 18:11", revision: "rev_0815", dataset: "ds_0818", result: "확인 중" },
      { id: "run-0912-c", project: "ko-embed 파인튠", recipe: "eval", status: "completed", detail: "primary metric 0.912", stage: "eval", stageStatus: "completed", priority: "interactive", vram: 0, updated: "09-07 23:58", revision: "rev_0913", dataset: "ds_0902", result: "성공" },
      { id: "run-0911-a", project: "ko-embed 파인튠", recipe: "finetune", status: "failed", detail: "OOM · batch 32", stage: "train", stageStatus: "failed", priority: "standard", vram: 0, updated: "09-06 14:03", revision: "rev_0827", dataset: "ds_0818", result: "실패" },
      { id: "run-0905-d", project: "영수증 OCR", recipe: "finetune", status: "cancelled", detail: "사용자 취소", stage: null, priority: "standard", vram: 0, updated: "09-05 11:30", revision: "rev_0901", dataset: "ds_0818", result: "취소" },
      { id: "run-0904-a", project: "ko-embed 파인튠", recipe: "finetune", status: "completed", detail: "primary metric 0.887", stage: "train", stageStatus: "completed", priority: "standard", vram: 0, updated: "09-04 19:12", revision: "rev_0827", dataset: "ds_0818", result: "성공" },
    ],
    stages: [{ name: "prepare", status: "completed", profile: "cpu", vram: 0 }, { name: "train", status: "running", profile: "gpu-large", vram: 6963 }, { name: "eval", status: "queued", profile: "gpu-small", vram: 2048 }],
    loss: [1.9, 1.4, 1.1, 0.92, 0.81, 0.74, 0.66, 0.61, 0.58, 0.55, 0.53, 0.5],
    trend: { labels: ["08-20", "08-24", "08-28", "09-01", "09-04", "09-07", "09-08"], series: [{ label: "ko-embed · recall@10", tone: 1, values: [0.842, 0.851, 0.861, 0.874, 0.887, 0.905, 0.912] }, { label: "ASR · WER↓", tone: 2, values: [0.182, 0.176, 0.171, null, 0.164, 0.161, 0.158] }] },
    logs: [{ level: "info", time: "18:42:01", text: "epoch 12/20 loss=0.502 lr=2e-5" }, { level: "ok", time: "18:42:05", text: "checkpoint saved: run-0913-a/ckpt-12.pt" }, { level: "warn", time: "18:42:09", text: "VRAM 여유 1.2 GiB, batch를 16으로 낮춥니다" }, { level: "info", time: "18:43:11", text: "epoch 13/20 loss=0.497 lr=2e-5" }, { level: "debug", time: "18:43:12", text: "dataloader workers=8 prefetch=2" }],
  },
  tokenScopes: ["models:read", "models:write", "leases:manage", "training:run", "tokens:manage"],
  tokens: [
    { id: "t1", label: "bonggu-host-agent", prefix: "bgt_9f2c", scopes: ["models:read", "leases:manage"], created: "2026-08-12 09:14", expires: null, last: "09-08 18:41" },
    { id: "t2", label: "galpi-transcribe", prefix: "bgt_41ae", scopes: ["models:read"], created: "2026-08-30 21:02", expires: "2026-09-29 21:02", last: "09-08 17:55" },
    { id: "t3", label: "ci-smoke", prefix: "bgt_c07d", scopes: ["models:read", "models:write"], created: "2026-07-02 11:30", expires: "2026-08-01 11:30", expired: true, last: "07-31 23:10" },
    { id: "t4", label: "old-notebook", prefix: "bgt_2b9e", scopes: ["training:run"], created: "2026-05-14 15:47", expires: null, revoked: true, last: "06-02 10:21" },
  ],
  fmt: {
    bytes: (v) => v == null ? "수집 안 됨" : v === 0 ? "0 B" : (() => { const u = ["B", "KiB", "MiB", "GiB", "TiB"]; const e = Math.min(Math.floor(Math.log(v) / Math.log(1024)), 4); const s = v / 1024 ** e; return `${s.toFixed(s >= 10 || e === 0 ? 0 : 1)} ${u[e]}`; })(),
    pct: (v, d = 0) => v == null ? "수집 안 됨" : `${v.toFixed(d)}%`,
    temp: (v) => v == null ? "수집 안 됨" : `${v.toFixed(1)}°C`,
    up: (s) => { if (s == null) return "수집 안 됨"; const m = Math.floor(s / 60); return `${Math.floor(m / 1440)}d ${String(Math.floor((m % 1440) / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; },
    gib: (mib) => `${(mib / 1024).toFixed(2)} GiB`,
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
