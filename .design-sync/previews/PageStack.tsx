import * as React from "react";
import { PageStack, PageHeader, Panel, CardHead, Grid, StatTile, Button } from "@dbwk10317/bonggu-design-system";

/* A direct child of the shell body; each screen starts with one PageStack. */
export const Screen = () => (
  <PageStack>
    <PageHeader title="노드" description="전국 매장에 설치한 엣지 노드 38대." actions={<Button variant="primary" icon="plus">노드 추가</Button>} />
    <Grid min={200}>
      <StatTile label="온라인" value={35} unit="대" />
      <StatTile label="수집 지연" value={2} unit="대" tone={4} />
      <StatTile label="연결 끊김" value={1} unit="대" tone={5} />
    </Grid>
    <Panel><CardHead title="지역별" meta="최근 24시간" /><p>서울 12 · 경기 8 · 부산 6 · 그 외 12</p></Panel>
    <Panel><CardHead title="최근 이벤트" /><p>edge-seoul-03 이 22분 동안 응답하지 않았습니다.</p></Panel>
  </PageStack>
);

/* sm when many sections feel cramped, lg when few feel sparse; default is md. */
export const Gaps = () => (
  <>
    {(["sm", "md", "lg"] as const).map((g) => (
      <PageStack key={g} gap={g}>
        <Panel padding="sm"><CardHead title={`gap="${g}"`} /></Panel>
        <Panel padding="sm"><CardHead title="다음 섹션" /></Panel>
      </PageStack>
    ))}
  </>
);
