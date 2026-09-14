import * as React from "react";
import { PasswordField, Field, Stack } from "@dbwk10317/bonggu-design-system";

/* No strength meter on sign-in — no reason to grade a password that's already set. */
export const SignIn = () => (
  <Field label="비밀번호">
    <PasswordField autoComplete="current-password" />
  </Field>
);

/* strength only when setting a new password, to show what's missing. */
export const NewPassword = () => {
  const [v, setV] = React.useState("bonggu");
  return (
    <div style={{ maxWidth: 360 }}>
      <Field label="임시 비밀번호" hint="첫 로그인에서 바로 바꾸게 됩니다.">
        <PasswordField strength value={v} onChange={(e) => setV(e.currentTarget.value)} autoComplete="new-password" />
      </Field>
    </div>
  );
};

export const Strengths = () => (
  <Stack gap={4} style={{ maxWidth: 360 }}>
    {["bg", "bonggu", "bonggu-edge", "bonggu-edge-2026", "b0nggu!Edge#2026"].map((s) => (
      <PasswordField key={s} strength value={s} readOnly aria-label={`강도 예시 ${s.length}자`} />
    ))}
  </Stack>
);
