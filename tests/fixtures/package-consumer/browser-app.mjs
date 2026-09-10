import React from "react";
import { Button, Panel, StatusPill, ToastProvider, useToast } from "@dbwk10317/bonggu-design-system";

function SaveButton() {
  const { toast } = useToast();
  return React.createElement(
    Button,
    {
      id: "fixture-save",
      variant: "primary",
      onClick: () => toast({ message: "저장 완료", tone: "ok", duration: 0 }),
    },
    "저장",
  );
}

export function BrowserApp() {
  return React.createElement(
    ToastProvider,
    { max: 2 },
    React.createElement(
      "main",
      { className: "fixture-shell" },
      React.createElement(
        Panel,
        { id: "fixture-panel", caption: "설치 패키지 hydration", fit: "flex" },
        React.createElement("img", {
          id: "fixture-mascot",
          src: "/node_modules/@dbwk10317/bonggu-design-system/dist/assets/mascot-neutral.svg",
          alt: "봉구",
          width: 64,
          height: 64,
        }),
        React.createElement(StatusPill, { tone: "ok" }, "패키지 정상"),
        React.createElement(SaveButton),
        React.createElement("ul", { id: "fixture-list" }, React.createElement("li", null, "전역 reset 확인")),
      ),
    ),
  );
}
