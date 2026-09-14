import * as React from "react";
import { AlertBanner, Stack, Button, Link } from "@dbwk10317/bonggu-design-system";

/* warn/crit use role="alert", so screen readers announce them immediately. */
export const Tones = () => (
  <Stack gap={3}>
    <AlertBanner tone="info" title="예정된 점검">9월 14일 02:00~03:00 사이 게이트웨이가 재시작됩니다.</AlertBanner>
    <AlertBanner tone="ok" title="롤아웃 완료">2.14.0 을 38대 모두에 적용했습니다.</AlertBanner>
    <AlertBanner tone="warn" title="수집 지연">노드 2대가 5초 주기를 놓치고 있습니다.</AlertBanner>
    <AlertBanner tone="crit" title="게이트웨이 응답 없음">22분째 값을 받지 못했습니다. 현장 확인이 필요합니다.</AlertBanner>
  </Stack>
);

/* Only add onClose when the banner is allowed to disappear. */
export const Dismissible = () => {
  const [on, setOn] = React.useState(true);
  return on
    ? <AlertBanner tone="info" title="새 에이전트 2.15.0-rc1" onClose={() => setOn(false)}>테스트 채널에서 먼저 받아 볼 수 있습니다.</AlertBanner>
    : <Button variant="secondary" onClick={() => setOn(true)}>배너 다시 보기</Button>;
};

export const WithAction = () => (
  <AlertBanner tone="warn" title="에이전트가 오래되었습니다">
    노드 2대가 <span className="bds-mono">2.13.2</span> 를 쓰고 있어 이 설정을 무시합니다. <Link href="#deploys">배포 화면에서 올리기</Link>
  </AlertBanner>
);

/* Skip the title for short one-line messages. */
export const TitleOnly = () => (
  <Stack gap={3}>
    <AlertBanner tone="info">읽기 전용 계정으로 보고 있습니다.</AlertBanner>
    <AlertBanner tone="crit" title="결제 리더기 2대 오프라인" />
  </Stack>
);
