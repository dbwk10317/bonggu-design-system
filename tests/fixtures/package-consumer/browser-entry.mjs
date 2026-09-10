import React from "react";
import { hydrateRoot } from "react-dom/client";
import "@dbwk10317/bonggu-design-system/styles.css";
import { BrowserApp } from "./browser-app.mjs";

hydrateRoot(document.getElementById("root"), React.createElement(BrowserApp));
requestAnimationFrame(() => requestAnimationFrame(() => {
  window.__fixtureHydrated = true;
}));
