import * as React from "react";
import { Grid, GridItem, Panel, CardHead, Stack } from "@dbwk10317/bonggu-design-system";

const Card = ({ n }: { n: React.ReactNode }) => (
  <Panel padding="sm"><CardHead title={<>{n}</>} /></Panel>
);

/* cols is the ideal column count; auto-fit collapses it as width shrinks. */
export const Cols = () => (
  <Stack gap={5}>
    <Grid cols={2}>{[1, 2, 3, 4].map((i) => <Card key={i} n={`cols=2 · ${i}`} />)}</Grid>
    <Grid cols={4}>{[1, 2, 3, 4].map((i) => <Card key={i} n={`cols=4 · ${i}`} />)}</Grid>
  </Stack>
);

/* Use min when cards have a minimum width they can't shrink below; replaces cols. */
export const MinWidth = () => (
  <Grid min={220}>
    {["온라인 노드", "초당 요청", "평균 응답", "오류율", "디스크"].map((t) => <Card key={t} n={t} />)}
  </Grid>
);

/* For a dashboard layout that needs an exact column count, use columns + GridItem span. */
export const TwelveColumn = () => (
  <Grid columns={12}>
    <GridItem span={8} spanMd={12}><Panel padding="sm"><CardHead title="요청 추이" meta="span 8" /></Panel></GridItem>
    <GridItem span={4} spanMd={12}><Panel padding="sm"><CardHead title="지역 비중" meta="span 4" /></Panel></GridItem>
    <GridItem span={4} spanMd={6} spanSm={12}><Panel padding="sm"><CardHead title="CPU" meta="span 4" /></Panel></GridItem>
    <GridItem span={4} spanMd={6} spanSm={12}><Panel padding="sm"><CardHead title="메모리" meta="span 4" /></Panel></GridItem>
    <GridItem span={4} spanMd={12}><Panel padding="sm"><CardHead title="디스크" meta="span 4" /></Panel></GridItem>
  </Grid>
);
