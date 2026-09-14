import * as React from "react";
import { AspectRatio, Grid, Stack } from "@dbwk10317/bonggu-design-system";

const Fill = ({ label }: { label: string }) => (
  <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "var(--fill-2)", borderRadius: "var(--r-sm)" }}>
    <span className="bds-mono">{label}</span>
  </div>
);

/* Reserves space before the image loads, preventing layout jump. */
export const Ratios = () => (
  <Grid min={160}>
    <AspectRatio ratio="16/9"><Fill label="16/9" /></AspectRatio>
    <AspectRatio ratio="4/3"><Fill label="4/3" /></AspectRatio>
    <AspectRatio ratio="1/1"><Fill label="1/1" /></AspectRatio>
  </Grid>
);

export const WithImage = () => (
  <Stack gap={3} style={{ maxWidth: 280 }}>
    <AspectRatio ratio="4/3">
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--series-1), var(--series-4))", borderRadius: "var(--r-sm)" }} />
    </AspectRatio>
    <span className="bds-mono">kiosk-0 · 2026-09-10 08:12</span>
  </Stack>
);

export const Numeric = () => (
  <div style={{ maxWidth: 240 }}>
    <AspectRatio ratio={2.35}><Fill label="2.35" /></AspectRatio>
  </div>
);
