import * as React from "react";
import { Button, Toolbar } from "@dbwk10317/bonggu-design-system";

export const Variants = () => (
  <Toolbar>
    <Button variant="primary" icon="check">적용</Button>
    <Button variant="secondary">소등</Button>
    <Button variant="ghost">+ 색 추가</Button>
    <Button variant="danger" icon="trash">삭제</Button>
  </Toolbar>
);

export const Sizes = () => (
  <Toolbar>
    <Button size="sm">sm 28px</Button>
    <Button size="md">md 32px</Button>
    <Button size="lg">lg 40px</Button>
  </Toolbar>
);

export const States = () => (
  <Toolbar>
    <Button variant="primary" busy>저장 중</Button>
    <Button disabled>비활성</Button>
    <Button variant="secondary" icon="arrow-clockwise" iconRight="caret-down">재시작</Button>
  </Toolbar>
);

export const FullWidth = () => (
  <div style={{ maxWidth: 320 }}>
    <Button variant="primary" fit="flex" icon="power">전체 재부팅</Button>
  </div>
);
