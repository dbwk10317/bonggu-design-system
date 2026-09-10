import * as React from "react";
import { Tag, Inline, Stack, Panel, CardHead } from "@dbwk10317/bonggu-design-system";

/* 분류를 붙이는 표식이다. 상태를 알리는 자리에는 StatusPill 을 쓴다. */
export const Basic = () => (
  <Inline gap={2}>
    <Tag>서울</Tag><Tag>BG-EDGE-2</Tag><Tag icon="tag">2.14.0</Tag><Tag accent>선택됨</Tag>
  </Inline>
);

/* onRemove 가 있으면 지울 수 있는 칩이 된다. 필터를 걷어내는 데 쓴다. */
export const Removable = () => {
  const [on, setOn] = React.useState(["서울", "경기", "부산", "온라인"]);
  return (
    <Panel padding="sm">
      <Stack gap={3}>
        <CardHead title="적용한 필터" meta={`${on.length}개`} />
        <Inline gap={2}>
          {on.length
            ? on.map((t) => <Tag key={t} onRemove={() => setOn((v) => v.filter((x) => x !== t))}>{t}</Tag>)
            : <span>필터가 없습니다. 모든 노드를 봅니다.</span>}
        </Inline>
      </Stack>
    </Panel>
  );
};

export const WithIcon = () => (
  <Inline gap={2}>
    <Tag icon="map-pin">서울 강남</Tag>
    <Tag icon="hard-drives">BG-EDGE-2</Tag>
    <Tag icon="clock-counter-clockwise">22분 전</Tag>
  </Inline>
);

/* 표 안에서는 행이 길어지지 않게 몇 개만 남기고 수로 접는다. */
export const InRow = () => (
  <Inline gap={2} align="center" wrap={false}>
    <span className="bds-mono">edge-seoul-01</span>
    <Tag>서울</Tag><Tag>결제</Tag><Tag>+3</Tag>
  </Inline>
);
