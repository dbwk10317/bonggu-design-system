/* The template loads as plain scripts, not ESM: bundle, mock data and screen modules all go through window, so their types are declared once here. Component types are the public entry's. */
import type { ComponentType } from "react";

declare global {
  /** Screen module names App looks up on window */
  type ScreenName = "OverviewScreen" | "NodesScreen" | "DevicesScreen" | "DeploysScreen" | "AccessScreen" | "SettingsScreen" | "StatusScreen";

  interface Window {
    DS: typeof import("../../public-entry.js");
    KIT: typeof import("./data.js");
    /** Namespace the bundle registers; the DS proxy reads it regardless of load order */
    Ds_d3ea90?: typeof import("../../public-entry.js");
    React: typeof import("react");
    /** Screen modules are IIFEs registered on window; App renders them by name */
    DashboardApp: ComponentType<any>;
    OverviewScreen: ComponentType<any>;
    NodesScreen: ComponentType<any>;
    DevicesScreen: ComponentType<any>;
    DeploysScreen: ComponentType<any>;
    AccessScreen: ComponentType<any>;
    SettingsScreen: ComponentType<any>;
    StatusScreen: ComponentType<any>;
    /** Empty component so a screen module can load without rendering */
    KitNoop: ComponentType<any>;
  }
  const React: typeof import("react");
}
export {};
