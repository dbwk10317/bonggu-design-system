import * as React from "react";
import { Icon, Inline } from "@dbwk10317/bonggu-design-system";

export const Common = () => (
  <Inline gap={3}>
    <Icon name="pulse" size={24} />
    <Icon name="bell" size={24} />
    <Icon name="gear-six" size={24} />
    <Icon name="warning" size={24} />
    <Icon name="cloud-arrow-up" size={24} />
    <Icon name="database" size={24} />
    <Icon name="cpu" size={24} />
    <Icon name="trash" size={24} />
  </Inline>
);

export const Sizes = () => (
  <Inline gap={3} align="center">
    <Icon name="pulse" size={12} />
    <Icon name="pulse" />
    <Icon name="pulse" size={20} />
    <Icon name="pulse" size={28} />
    <Icon name="pulse" size={40} />
  </Inline>
);

export const Labelled = () => (
  <Inline gap={3} align="center">
    <Icon name="warning" size={18} label="주의" />
    <span>단독 의미가 있으면 label을 준다</span>
  </Inline>
);
