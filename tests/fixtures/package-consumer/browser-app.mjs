import React, { useRef, useState } from "react";
import { Button, Chart, DataTable, Field, Modal, Panel, Select, SidebarNavItem, SidebarShell, StatusPill, TextField, ToastProvider, useToast } from "@dbwk10317/bonggu-design-system";

// Node 가 서버 렌더도 하므로 JSX 없이 쓴다.
const h = React.createElement;
const rows = [{ id: "a", name: "edge-a", cpu: 12 }, { id: "b", name: "edge-b", cpu: null }];
const columns = [{ key: "name", header: "이름" }, { key: "cpu", header: "CPU", align: "num" }];

function SaveButton() {
  const { toast } = useToast();
  return h(Button, { id: "fixture-save", variant: "primary", onClick: () => toast({ message: "저장 완료", tone: "ok", duration: 0 }) }, "저장");
}

/** 소비처가 첫 주에 쓰는 폼: 입력 ref 로 포커스, 네이티브 select 값, 제출, 확인 모달. */
function NodeForm() {
  const input = useRef(null);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [open, setOpen] = useState(false);
  return h(
    "form",
    { id: "fixture-form", onSubmit: (event) => { event.preventDefault(); setSubmitted(`${new FormData(event.currentTarget).get("region")}:${name}`); } },
    h(Field, { label: "노드 이름", id: "fixture-name" }, h(TextField, { ref: input, value: name, onChange: (event) => setName(event.target.value) })),
    h(Field, { label: "지역", id: "fixture-region" }, h(Select, { name: "region", options: [{ value: "seoul", label: "서울" }, { value: "busan", label: "부산" }], defaultValue: "seoul" })),
    h(Button, { type: "submit", id: "fixture-submit" }, "등록"),
    h(Button, { type: "button", id: "fixture-focus", onClick: () => input.current?.focus() }, "이름으로"),
    h(Button, { type: "button", id: "fixture-open", onClick: () => setOpen(true) }, "확인 열기"),
    submitted && h("output", { id: "fixture-submitted" }, submitted),
    h(Modal, { open, onClose: () => setOpen(false), title: "등록 확인", actions: h(Button, { id: "fixture-close", onClick: () => setOpen(false) }, "닫기") }, "모달 본문"),
  );
}

function NodeTable() {
  const [selected, setSelected] = useState([]);
  return h(DataTable, { "aria-label": "노드", columns, rows, rowKey: (row) => row.id, rowLabel: (row) => row.name, selectable: true, selectedKeys: selected, onSelectionChange: setSelected });
}

export function BrowserApp() {
  return h(
    ToastProvider,
    { max: 2 },
    h(
      SidebarShell,
      { id: "fixture-shell", brand: { name: "fixture" }, nav: h(SidebarNavItem, { label: "개요", active: true }) },
      h(
        "main",
        { className: "fixture-shell" },
        h(
          Panel,
          { id: "fixture-panel", caption: "설치 패키지 hydration", fit: "flex" },
          h("img", { id: "fixture-mascot", src: "/node_modules/@dbwk10317/bonggu-design-system/dist/assets/mascot-neutral.svg", alt: "봉구", width: 64, height: 64 }),
          h(StatusPill, { tone: "ok" }, "패키지 정상"),
          h(SaveButton),
          h("ul", { id: "fixture-list" }, h("li", null, "전역 reset 확인")),
          h(NodeForm),
          h(NodeTable),
          h(Chart, { kind: "line", "aria-label": "요청", labels: ["1", "2", "3", "4"], series: [{ label: "요청", tone: 1, values: [1, 2, null, 4] }] }),
        ),
      ),
    ),
  );
}
