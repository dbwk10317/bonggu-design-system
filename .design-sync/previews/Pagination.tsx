import * as React from "react";
import { Pagination, Stack, Panel } from "@dbwk10317/bonggu-design-system";

const PER = 20, TOTAL_ROWS = 184;

export const Basic = () => {
  const [page, setPage] = React.useState(1);
  const total = Math.ceil(TOTAL_ROWS / PER);
  const from = (page - 1) * PER + 1;
  return (
    <Pagination
      page={page} total={total} onChange={setPage}
      info={<>{from}–{Math.min(page * PER, TOTAL_ROWS)} / {TOTAL_ROWS}</>}
    />
  );
};

/* 페이지가 많으면 현재 위치 양옆만 남기고 접는다. siblings 로 몇 개를 남길지 정한다. */
export const ManyPages = () => (
  <Stack gap={4}>
    <Pagination page={12} total={40} siblings={1} aria-label="siblings 1" />
    <Pagination page={12} total={40} siblings={2} aria-label="siblings 2" />
  </Stack>
);

export const Edges = () => (
  <Stack gap={4}>
    <Pagination page={1} total={9} aria-label="첫 페이지" />
    <Pagination page={9} total={9} aria-label="마지막 페이지" />
    <Pagination page={1} total={1} aria-label="한 페이지뿐" />
  </Stack>
);

/* 표 아래에 둔다. 20행이 넘어갈 때부터 의미가 있다. */
export const UnderTable = () => (
  <Panel>
    <div style={{ minHeight: 72 }}>노드 20행</div>
    <Pagination page={2} total={2} size="sm" info="21–38 / 38" />
  </Panel>
);
