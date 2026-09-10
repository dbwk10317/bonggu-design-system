import * as React from "react";
import { Grid, GridItem, Panel, CardHead, Stack } from "@dbwk10317/bonggu-design-system";

const Cell = ({ label }: { label: string }) => (
  <Panel padding="sm"><CardHead title={label} /></Panel>
);

/* span 은 Grid columns 기준 칸 수다. Grid 에 columns 를 주지 않으면 아무 효과가 없다. */
export const Spans = () => (
  <Grid columns={12}>
    <GridItem span={12}><Cell label="span 12" /></GridItem>
    <GridItem span={6}><Cell label="span 6" /></GridItem>
    <GridItem span={6}><Cell label="span 6" /></GridItem>
    <GridItem span={4}><Cell label="span 4" /></GridItem>
    <GridItem span={4}><Cell label="span 4" /></GridItem>
    <GridItem span={4}><Cell label="span 4" /></GridItem>
  </Grid>
);

/* 좁아질 때 몇 칸으로 접을지 따로 준다. 480px 미만은 언제나 전폭이다. */
export const Responsive = () => (
  <Stack gap={4}>
    <p className="bds-mono">span 8 / spanMd 12 · span 4 / spanMd 6 / spanSm 12</p>
    <Grid columns={12}>
      <GridItem span={8} spanMd={12}><Cell label="본문" /></GridItem>
      <GridItem span={4} spanMd={12}><Cell label="곁다리" /></GridItem>
      <GridItem span={4} spanMd={6} spanSm={12}><Cell label="CPU" /></GridItem>
      <GridItem span={4} spanMd={6} spanSm={12}><Cell label="메모리" /></GridItem>
      <GridItem span={4} spanMd={12} spanSm={12}><Cell label="디스크" /></GridItem>
    </Grid>
  </Stack>
);
