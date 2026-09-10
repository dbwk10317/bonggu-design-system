import * as React from "react";
import { MascotMark, Inline, Stack } from "@dbwk10317/bonggu-design-system";

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Stack gap={1} align="center" style={{ width: 84 }}>
    {children}
    <span style={{ fontSize: 11, opacity: 0.7 }}>{label}</span>
  </Stack>
);

export const Faces = () => (
  <Inline gap={3} align="start">
    <Cell label="smiling 정상"><MascotMark face="smiling" size="md" animated={false} /></Cell>
    <Cell label="worried 지연"><MascotMark face="worried" size="md" animated={false} /></Cell>
    <Cell label="crying 끊김"><MascotMark face="crying" size="md" animated={false} /></Cell>
    <Cell label="sleepy 연결 중"><MascotMark face="sleepy" size="md" animated={false} /></Cell>
  </Inline>
);

export const MoreFaces = () => (
  <Inline gap={3} align="start">
    <Cell label="neutral"><MascotMark face="neutral" size="md" animated={false} /></Cell>
    <Cell label="curious"><MascotMark face="curious" size="md" animated={false} /></Cell>
    <Cell label="surprised"><MascotMark face="surprised" size="md" animated={false} /></Cell>
    <Cell label="excited"><MascotMark face="excited" size="md" animated={false} /></Cell>
    <Cell label="blank"><MascotMark face="blank" size="md" animated={false} /></Cell>
  </Inline>
);

export const Sizes = () => (
  <Inline gap={3} align="end">
    <MascotMark size="xs" animated={false} aria-label="봉구 xs" />
    <MascotMark size="sm" animated={false} aria-label="봉구 sm" />
    <MascotMark size="md" animated={false} aria-label="봉구 md" />
    <MascotMark size="lg" animated={false} aria-label="봉구 lg" />
    <MascotMark size="xl" animated={false} aria-label="봉구 xl" />
  </Inline>
);
