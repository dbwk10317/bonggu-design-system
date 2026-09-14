import * as React from "react";
import { AvatarGroup, Stack, Inline } from "@dbwk10317/bonggu-design-system";

const TEAM = [
  { name: "정유현", status: "ok" as const },
  { name: "김서연", status: "ok" as const },
  { name: "박도윤", status: "warn" as const },
  { name: "이하준", status: "off" as const },
  { name: "최민서" },
  { name: "Alex Kim" },
];

export const Basic = () => <AvatarGroup users={TEAM} />;

/* Beyond max, extras collapse into a +n badge instead of wrapping. */
export const Overflow = () => (
  <Stack gap={4}>
    <AvatarGroup users={TEAM} max={3} />
    <AvatarGroup users={TEAM} max={5} />
  </Stack>
);

export const Sizes = () => (
  <Stack gap={4}>
    <Inline gap={3} align="center"><span className="bds-mono">xs</span><AvatarGroup users={TEAM} max={4} size="xs" /></Inline>
    <Inline gap={3} align="center"><span className="bds-mono">sm</span><AvatarGroup users={TEAM} max={4} size="sm" /></Inline>
    <Inline gap={3} align="center"><span className="bds-mono">md</span><AvatarGroup users={TEAM} max={4} size="md" /></Inline>
    <Inline gap={3} align="center"><span className="bds-mono">lg</span><AvatarGroup users={TEAM} max={4} size="lg" /></Inline>
  </Stack>
);
