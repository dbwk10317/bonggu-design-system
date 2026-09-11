import * as React from "react";
import { EmptyState, Panel, Button, Inline, Stack } from "@dbwk10317/bonggu-design-system";

/* 아직 아무것도 없는 자리. 표정으로 이게 문제인지 아닌지를 먼저 알린다. */
export const FirstRun = () => (
  <Panel>
    <EmptyState
      face="curious"
      title="아직 등록된 노드가 없습니다"
      description="매장 단말에서 설치 명령을 한 번 실행하면 여기에 나타납니다."
      actions={<Inline gap={2}><Button variant="secondary">설치 안내</Button><Button variant="primary" icon="plus">노드 추가</Button></Inline>}
    />
  </Panel>
);

/* 필터 때문에 비었을 때는 "없다"가 아니라 "이 조건에 없다"고 말한다. */
export const NoResults = () => (
  <Panel>
    <EmptyState
      face="blank"
      title="이 조건에 맞는 노드가 없습니다"
      description="지역 필터를 넓히거나 검색어를 지워 봅니다."
      actions={<Button variant="secondary">필터 지우기</Button>}
    />
  </Panel>
);

/* 잘못된 상태는 tone="error". 표정도 같이 바꾼다. */
export const Error_ = () => (
  <Panel>
    <EmptyState
      tone="error"
      face="worried"
      title="게이트웨이에 닿지 못했습니다"
      description="22분째 응답이 없습니다. 네트워크를 확인한 뒤 다시 시도합니다."
      actions={<Button variant="primary" icon="arrows-clockwise">다시 시도</Button>}
    />
  </Panel>
);

/* 좁은 자리(카드 안, 드로어)에서는 plain 으로 여백과 마크를 줄인다. */
export const Compact = () => (
  <Stack gap={4}>
    <Panel padding="sm"><EmptyState plain face={false} title="최근 7일 동안 남은 기록이 없습니다" /></Panel>
    <Panel padding="sm"><EmptyState plain face="sleepy" title="알림이 없습니다" description="새 알림이 오면 여기에 쌓입니다." /></Panel>
  </Stack>
);
