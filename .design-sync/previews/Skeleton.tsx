import * as React from "react";
import { Skeleton, Panel, Stack, Inline, Grid, CardHead } from "@dbwk10317/bonggu-design-system";

export const Variants = () => (
  <Stack gap={5}>
    <Skeleton variant="text" lines={3} />
    <Skeleton variant="block" height={80} />
    <Inline gap={3} align="center"><Skeleton variant="circle" width={32} height={32} /><Skeleton variant="text" width={160} /></Inline>
  </Stack>
);

/* Match the shape of the incoming content so nothing shifts when it arrives. */
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

/* Use fixed where the width is set; otherwise it follows the parent's width. */
export const Sizing = () => (
  <Stack gap={3}>
    <Skeleton variant="block" height={16} />
    <Skeleton variant="block" fit="fixed" width={240} height={16} />
    <Skeleton variant="block" fit="fixed" width="60%" height={16} />
  </Stack>
);
