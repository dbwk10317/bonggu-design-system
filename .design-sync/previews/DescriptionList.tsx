import * as React from "react";
import { DescriptionList } from "@dbwk10317/bonggu-design-system";

export const NodeDetail = () => (
  <DescriptionList
    items={[
      { term: "호스트", detail: "edge-gateway-03", mono: true },
      { term: "리전", detail: "ap-northeast-2a" },
      { term: "커널", detail: "6.8.0-45-generic", mono: true },
      { term: "가동", detail: "42일 6시간" },
      { term: "마지막 배포", detail: "2026-09-08 14:22 KST", mono: true },
    ]}
  />
);

export const WithMissing = () => (
  <DescriptionList
    items={[
      { term: "인증서 만료", detail: "2027-01-14", mono: true },
      { term: "평균 응답", detail: "수집 안 됨" },
      { term: "담당", detail: "플랫폼팀" },
    ]}
  />
);
