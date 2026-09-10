import * as React from "react";
import { PageHeader, PageStack, Button, Inline, Stack, Panel } from "@dbwk10317/bonggu-design-system";

/* 화면의 첫 줄이다. 제목은 무슨 화면인지, description 은 여기서 무엇을 할 수 있는지. */
export const Basic = () => (
  <PageHeader title="배포" description="에이전트와 장치 펌웨어를 단계별로 내보냅니다." />
);

export const WithActions = () => (
  <PageHeader
    title="접근"
    description="이 조직의 콘솔을 쓸 수 있는 사람과 자동화 토큰."
    actions={<Inline gap={2}><Button variant="secondary" icon="download">감사 로그</Button><Button variant="primary" icon="user-plus">사람 초대</Button></Inline>}
  />
);

export const TitleOnly = () => <PageHeader title="상태 페이지" />;

export const InScreen = () => (
  <PageStack>
    <PageHeader title="설정" description="수집 주기와 보존 기간은 모든 노드에 함께 적용됩니다." actions={<Button variant="primary">저장</Button>} />
    <Panel><Stack gap={3}><b>수집</b><p>5초마다 값을 올립니다.</p></Stack></Panel>
  </PageStack>
);
