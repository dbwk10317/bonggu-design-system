import * as React from "react";
import { Panel, CardHead, KeyValues, Chart, StatusPill, Grid, Inline } from "@dbwk10317/bonggu-design-system";

export const WithChart = () => (
  <div style={{ maxWidth: 360 }}>
    <Panel>
      <CardHead title="CPU" meta="Ryzen 9 7950X" metaMono />
      <Chart
        kind="radial"
        value={0.62}
        label="정상"
        tone="ok"
        fit="fixed"
        width={150}
        height={110}
        aria-label="CPU 사용률"
        valueFormatter={(v) => `${Math.round(v * 100)}%`}
      />
    </Panel>
  </div>
);

export const WithKeyValues = () => (
  <div style={{ maxWidth: 360 }}>
    <Panel caption="GPU 메모리 예약">
      <CardHead title="RTX 4090" meta="24 GiB" metaMono />
      <KeyValues
        lined
        rows={[
          ["모델", "9.2 GiB"],
          ["학습", "4.1 GiB"],
          ["여유", "10.7 GiB"],
          ["예약", null],
        ]}
      />
    </Panel>
  </div>
);

export const Densities = () => (
  <Grid min="200px">
    <Panel padding="sm">
      <CardHead title="padding=sm" meta="조밀" />
      <Inline><StatusPill tone="ok" size="sm">실행 중</StatusPill></Inline>
    </Panel>
    <Panel>
      <CardHead title="padding=md" meta="기본" />
      <Inline><StatusPill tone="warn" size="sm">지연</StatusPill></Inline>
    </Panel>
    <Panel sunken>
      <CardHead title="sunken" meta="배경 안쪽" />
      <Inline><StatusPill tone="off" size="sm">중지</StatusPill></Inline>
    </Panel>
  </Grid>
);

export const Selectable = () => (
  <Grid min="180px">
    <Panel as="button" interactive selected aria-pressed={true}>
      <CardHead title="서울 리전" meta="ap-northeast-2" metaMono />
      <Inline><StatusPill tone="ok" size="sm">선택됨</StatusPill></Inline>
    </Panel>
    <Panel as="button" interactive aria-pressed={false}>
      <CardHead title="도쿄 리전" meta="ap-northeast-1" metaMono />
      <Inline><StatusPill tone="info" size="sm">대기</StatusPill></Inline>
    </Panel>
  </Grid>
);
