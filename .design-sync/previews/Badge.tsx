import * as React from "react";
import { Badge, IconButton, Toolbar } from "@dbwk10317/bonggu-design-system";

export const OnIconButton = () => (
  <Toolbar>
    <Badge count={12} tone="crit"><IconButton icon="bell" aria-label="알림" /></Badge>
    <Badge count={3} tone="warn"><IconButton icon="warning" aria-label="경고" /></Badge>
    <Badge dot tone="ok"><IconButton icon="pulse" aria-label="실시간" /></Badge>
  </Toolbar>
);

export const Tones = () => (
  <Toolbar>
    <Badge count={7} tone="ok" />
    <Badge count={7} tone="warn" />
    <Badge count={7} tone="crit" />
    <Badge count={7} tone="accent" />
    <Badge count={7} tone="neutral" />
  </Toolbar>
);

export const Overflow = () => (
  <Toolbar>
    <Badge count={99} />
    <Badge count={128} max={99} />
    <Badge count={1204} max={999} tone="crit" />
  </Toolbar>
);
