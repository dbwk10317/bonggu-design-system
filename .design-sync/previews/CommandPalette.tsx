import * as React from "react";
import { CommandPalette, Button, Stack, Kbd, Inline } from "@dbwk10317/bonggu-design-system";

const COMMANDS = [
  { id: "overview", label: "개요", group: "이동", icon: "pulse", hint: <span className="bds-mono">#overview</span> },
  { id: "nodes", label: "노드", group: "이동", icon: "hard-drives", hint: <span className="bds-mono">#nodes</span> },
  { id: "deploys", label: "배포", group: "이동", icon: "rocket-launch", hint: <span className="bds-mono">#deploys</span> },
  { id: "theme", label: "다크 테마로 바꾸기", group: "표시", icon: "moon" },
  { id: "readall", label: "알림 모두 읽음으로", group: "표시", icon: "bell" },
  { id: "restart", label: "선택한 노드 재시작", group: "동작", icon: "arrow-clockwise", keywords: "reboot 재부팅" },
];

/* inline 은 딤 없이 패널만 그린다. 문서와 미리보기용이고, 앱에서는 쓰지 않는다. */
export const Inline_ = () => <CommandPalette inline items={COMMANDS} placeholder="화면 이동, 표시 바꾸기" />;

/* 앱에서는 모달 세션이다. 열 때마다 검색어와 강조가 초기화되고,
   명령은 세션이 닫힌 뒤 실행된다(열린 채로는 바깥 요소가 inert 라 포커스를 못 옮긴다). */
export const Modal_ = () => {
  const [open, setOpen] = React.useState(false);
  const [ran, setRan] = React.useState("아직 없음");
  React.useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  return (
    <Stack gap={3}>
      <Inline gap={3} align="center">
        <Button variant="secondary" icon="magnifying-glass" onClick={() => setOpen(true)}>명령 팔레트</Button>
        <span><Kbd>Ctrl</Kbd> <Kbd>K</Kbd></span>
      </Inline>
      <span className="bds-mono">마지막 명령: {ran}</span>
      <CommandPalette
        open={open} onClose={() => setOpen(false)} placeholder="화면 이동, 표시 바꾸기"
        items={COMMANDS.map((c) => ({ ...c, onSelect: () => setRan(c.id) }))}
      />
    </Stack>
  );
};

/* keywords 로 다른 말로 찾아도 걸리게 한다("reboot" 으로 "재시작"). */
export const Keywords = () => (
  <CommandPalette
    inline
    placeholder="reboot 라고 쳐도 재시작이 나옵니다"
    items={[
      { id: "restart", label: "선택한 노드 재시작", group: "동작", icon: "arrow-clockwise", keywords: "reboot 재부팅 restart" },
      { id: "isolate", label: "노드 격리", group: "동작", icon: "plugs", keywords: "drain cordon 차단" },
      { id: "export", label: "노드 목록 내보내기", group: "동작", icon: "download", keywords: "csv 다운로드" },
    ]}
  />
);
