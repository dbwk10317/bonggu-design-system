import * as React from "react";
import { Grid, GridItem, Panel, CardHead, Stack } from "@dbwk10317/bonggu-design-system";

const Card = ({ n }: { n: React.ReactNode }) => (
  <Panel padding="sm"><CardHead title={<>{n}</>} /></Panel>
);

/* cols 는 "이상적인 열 수"다. 폭이 줄면 auto-fit 이 알아서 접는다. */
export const Cols = () => (
  <Stack gap={5}>
    <Grid cols={2}>{[1, 2, 3, 4].map((i) => <Card key={i} n={`cols=2 · ${i}`} />)}</Grid>
    <Grid cols={4}>{[1, 2, 3, 4].map((i) => <Card key={i} n={`cols=4 · ${i}`} />)}</Grid>
  </Stack>
);

/* 카드가 찌그러지면 안 되는 최소 폭이 있을 때는 min 을 준다. cols 대신 쓰인다. */
export const MinWidth = () => (
  <Grid min={220}>
    {["온라인 노드", "초당 요청", "평균 응답", "오류율", "디스크"].map((t) => <Card key={t} n={t} />)}
  </Grid>
);

/* 열 수를 직접 잡아야 하는 대시보드 배치는 columns + GridItem span. */
export const TwelveColumn = () => (
  <Grid columns={12}>
    <GridItem span={8} spanMd={12}><Panel padding="sm"><CardHead title="요청 추이" meta="span 8" /></Panel></GridItem>
    <GridItem span={4} spanMd={12}><Panel padding="sm"><CardHead title="지역 비중" meta="span 4" /></Panel></GridItem>
    <GridItem span={4} spanMd={6} spanSm={12}><Panel padding="sm"><CardHead title="CPU" meta="span 4" /></Panel></GridItem>
    <GridItem span={4} spanMd={6} spanSm={12}><Panel padding="sm"><CardHead title="메모리" meta="span 4" /></Panel></GridItem>
    <GridItem span={4} spanMd={12}><Panel padding="sm"><CardHead title="디스크" meta="span 4" /></Panel></GridItem>
  </Grid>
);
