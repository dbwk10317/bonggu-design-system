import * as React from "react";
import { Sparkline, Inline, Stack } from "@dbwk10317/bonggu-design-system";

const cpu = [31, 34, 30, 42, 58, 51, 47, 63, 71, 66, 59, 62, 78, 74, 69];
const rps = [820, 910, 880, 1240, 1180, 1360, 1420, 1290, 1510, 1470, 1380, 1600];

export const Lines = () => (
  <Stack gap={4}>
    <div style={{ height: 40 }}><Sparkline values={cpu} /></div>
    <div style={{ height: 40 }}><Sparkline values={rps} tone={2} /></div>
  </Stack>
);

export const Area = () => (
  <div style={{ height: 48 }}><Sparkline values={cpu} tone={3} area /></div>
);

/* null은 수집되지 않은 구간이라 선을 끊는다. 0으로 메우지 않는다. */
export const WithGaps = () => (
  <div style={{ height: 48 }}>
    <Sparkline values={[24, 28, 31, null, null, 44, 52, 49, 61, 58]} tone={4} area />
  </div>
);

export const Inline_ = () => (
  <Inline gap={3} align="center">
    <span className="bds-mono">62%</span>
    <div style={{ width: 96, height: 24 }}><Sparkline values={cpu} /></div>
  </Inline>
);
