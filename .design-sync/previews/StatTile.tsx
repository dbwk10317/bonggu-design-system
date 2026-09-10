import * as React from "react";
import { StatTile, Grid, Panel, Tag, Inline } from "@dbwk10317/bonggu-design-system";

const cpu = [31, 34, 30, 42, 58, 51, 47, 63, 71, 66, 59, 62];

export const Basic = () => (
  <Grid min={200}>
    <StatTile label="온라인 노드" value={35} unit="대" delta={-2} deltaLabel="어제 대비" icon="hard-drives" />
    <StatTile label="초당 요청" value={1483} unit="rps" delta={12.4} spark={cpu} tone={2} />
    <StatTile label="평균 응답" value={38.2} unit="ms" digits={1} delta={-4.1} tone={3} />
  </Grid>
);

/* 결측은 0이 아니다. 수집이 끊긴 값은 "수집 안 됨"으로 두고 단위도 붙이지 않는다. */
export const Missing = () => (
  <Grid min={200}>
    <StatTile label="엣지 캐시 적중률" value={null} unit="%" icon="database" />
    <StatTile label="누적 오류" value={0} unit="건" pill={{ tone: "ok", text: "정상" }} />
  </Grid>
);

export const WithPillAndDetail = () => (
  <StatTile
    label="디스크 사용량" value={91} unit="%" tone={5}
    pill={{ tone: "crit", text: "임계" }}
    detail={<Inline gap={2}><Tag>edge-seoul-03</Tag><span className="bds-mono">4.1 / 4.5 TB</span></Inline>}
  />
);

/* Panel 안에 여러 개를 나란히 둘 때는 flat 으로 테두리를 겹치지 않게 한다. */
export const FlatInPanel = () => (
  <Panel padding="sm">
    <Grid min={160} gap={0}>
      <StatTile flat label="수집 주기" value="5s" />
      <StatTile flat label="에이전트" value="2.14.0" />
      <StatTile flat label="매장" value={14} unit="곳" />
    </Grid>
  </Panel>
);
