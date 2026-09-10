import * as React from "react";
import { DataTable, StatusPill } from "@dbwk10317/bonggu-design-system";

type Row = { name: string; state: "ok" | "warn" | "crit"; cpu: number | null; mem: string; domain: string };

const rows: Row[] = [
  { name: "monitoring-api", state: "ok", cpu: 12.4, mem: "412 MiB", domain: "api.bonggu.io" },
  { name: "ingest-worker", state: "warn", cpu: 78.1, mem: "1.9 GiB", domain: "worker.bonggu.io" },
  { name: "media-transcoder", state: "crit", cpu: 96.3, mem: "3.4 GiB", domain: "media.bonggu.io" },
  { name: "legacy-cron", state: "ok", cpu: null, mem: "88 MiB", domain: "cron.bonggu.io" },
];

const tone = { ok: "실행 중", warn: "지연", crit: "과부하" } as const;

export const Services = () => (
  <DataTable
    aria-label="서비스"
    header={{ title: "서비스", meta: "방금 갱신" }}
    rows={rows}
    rowKey={(r: Row) => r.name}
    columns={[
      { key: "name", header: "이름" },
      {
        key: "state",
        header: "상태",
        render: (r: Row) => <StatusPill tone={r.state} size="sm">{tone[r.state]}</StatusPill>,
      },
      { key: "cpu", header: "CPU %", align: "num", sortable: true },
      { key: "mem", header: "메모리", align: "num", hideBelow: "tablet" },
      { key: "domain", header: "도메인", hideBelow: "desktop" },
    ]}
  />
);

export const Expandable = () => (
  <DataTable
    aria-label="서비스 상세"
    header={{ title: "펼쳐 보기", meta: "행을 눌러 상세" }}
    rows={rows.slice(0, 3)}
    rowKey={(r: Row) => r.name}
    defaultExpandedKeys={["ingest-worker"]}
    columns={[
      { key: "name", header: "이름" },
      { key: "cpu", header: "CPU %", align: "num" },
    ]}
    expandable={(r: Row) => (
      <span className="bds-mono">CPU {r.cpu ?? "수집 안 됨"} · 메모리 {r.mem} · {r.domain}</span>
    )}
  />
);

export const Selectable = () => (
  <DataTable
    aria-label="선택 가능한 서비스"
    header={{ title: "일괄 작업", meta: "2건 선택됨" }}
    rows={rows}
    rowKey={(r: Row) => r.name}
    selectable
    selectedKeys={["monitoring-api", "ingest-worker"]}
    columns={[
      { key: "name", header: "이름" },
      { key: "mem", header: "메모리", align: "num" },
    ]}
  />
);

export const Empty = () => (
  <DataTable
    aria-label="빈 표"
    header={{ title: "격리된 노드", meta: "0건" }}
    rows={[]}
    columns={[
      { key: "name", header: "이름" },
      { key: "cpu", header: "CPU %", align: "num" },
    ]}
  />
);
