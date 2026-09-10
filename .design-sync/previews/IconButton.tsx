import * as React from "react";
import { IconButton, Toolbar } from "@dbwk10317/bonggu-design-system";

export const Variants = () => (
  <Toolbar>
    <IconButton icon="gear-six" aria-label="설정" />
    <IconButton icon="arrow-clockwise" aria-label="새로고침" variant="outline" />
    <IconButton icon="trash" aria-label="삭제" variant="danger" />
  </Toolbar>
);

export const Sizes = () => (
  <Toolbar>
    <IconButton icon="x" aria-label="닫기" size="sm" />
    <IconButton icon="x" aria-label="닫기" size="md" />
    <IconButton icon="x" aria-label="닫기" size="lg" />
  </Toolbar>
);

export const WithBadge = () => (
  <Toolbar>
    <IconButton icon="bell" aria-label="알림" badge={3} />
    <IconButton icon="envelope" aria-label="메시지" badge={128} />
    <IconButton icon="warning" aria-label="경고" variant="danger" badge={1} />
  </Toolbar>
);

export const Disabled = () => (
  <Toolbar>
    <IconButton icon="play" aria-label="시작" disabled />
    <IconButton icon="stop" aria-label="중지" variant="outline" disabled />
  </Toolbar>
);
