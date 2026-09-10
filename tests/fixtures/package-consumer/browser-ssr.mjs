import React from "react";
import { renderToString } from "react-dom/server";
import { BrowserApp } from "./browser-app.mjs";

process.stdout.write(renderToString(React.createElement(BrowserApp)));
