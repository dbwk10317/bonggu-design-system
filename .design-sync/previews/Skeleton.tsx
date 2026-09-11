import * as React from "react";
import { Skeleton, Panel, Stack, Inline, Grid, CardHead } from "@dbwk10317/bonggu-design-system";

export const Variants = () => (
  <Stack gap={5}>
    <Skeleton variant="text" lines={3} />
    <Skeleton variant="block" height={80} />
    <Inline gap={3} align="center"><Skeleton variant="circle" width={32} height={32} /><Skeleton variant="text" width={160} /></Inline>
  </Stack>
);

/* 곧 들어올 내용과 같은 모양으로 둔다. 도착했을 때 자리가 흔들리지 않아야 한다. */
export const CardShape = () => (
  <Grid min={200}>
    {[0, 1, 2].map((i) => (
      <Panel key={i} padding="sm">
        <Stack gap={3}>
          <Skeleton variant="text" width={72} />
          <Skeleton variant="block" height={28} width={96} />
          <Skeleton variant="text" width={120} />
        </Stack>
      </Panel>
    ))}
  </Grid>
);

export const TableShape = () => (
  <Panel>
    <CardHead title="노드" meta="불러오는 중" />
    <Stack gap={3}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Inline key={i} gap={4} align="center" wrap={false}>
          <Skeleton variant="circle" width={24} height={24} />
          <Skeleton variant="text" width={140} />
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={56} />
        </Inline>
      ))}
    </Stack>
  </Panel>
);

/* 폭이 정해진 자리에는 fixed. 그 밖에는 부모 폭을 따른다. */
export const Sizing = () => (
  <Stack gap={3}>
    <Skeleton variant="block" height={16} />
    <Skeleton variant="block" fit="fixed" width={240} height={16} />
    <Skeleton variant="block" fit="fixed" width="60%" height={16} />
  </Stack>
);
