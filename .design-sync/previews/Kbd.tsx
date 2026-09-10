import * as React from "react";
import { Kbd, Stack, Inline, Panel, CardHead, Tooltip, IconButton } from "@dbwk10317/bonggu-design-system";

export const Basic = () => (
  <Inline gap={3} align="center">
    <span><Kbd>Ctrl</Kbd> <Kbd>K</Kbd> 명령 팔레트</span>
    <span><Kbd>/</Kbd> 검색</span>
    <span><Kbd>Esc</Kbd> 닫기</span>
  </Inline>
);

/* 툴팁 안에서 단축키를 알린다. 아이콘만 있는 버튼은 이름과 단축키를 함께 준다. */
export const InTooltip = () => (
  <Tooltip content={<>명령 팔레트 <Kbd>Ctrl</Kbd> <Kbd>K</Kbd></>}>
    <IconButton icon="magnifying-glass" variant="ghost" aria-label="명령 팔레트 열기" />
  </Tooltip>
);

export const Cheatsheet = () => (
  <Panel>
    <CardHead title="단축키" meta="이 화면" />
    <Stack gap={2}>
      {[
        [<><Kbd>Ctrl</Kbd> <Kbd>K</Kbd></>, "명령 팔레트"],
        [<Kbd>/</Kbd>, "노드 검색으로"],
        [<><Kbd>Shift</Kbd> <Kbd>R</Kbd></>, "선택한 노드 재시작"],
        [<Kbd>Esc</Kbd>, "열린 창 닫기"],
      ].map(([keys, what], i) => (
        <Inline key={i} gap={3} align="center">
          <span style={{ minWidth: 96 }}>{keys}</span>
          <span>{what}</span>
        </Inline>
      ))}
    </Stack>
  </Panel>
);
