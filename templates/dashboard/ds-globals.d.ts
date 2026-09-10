/* 템플릿은 ESM 이 아니라 script 로 로드된다. 번들·목 데이터·화면 모듈이 모두 window 를 거치므로
   타입도 여기서 한 번 선언한다. 컴포넌트 타입은 공개 진입점 그대로다. */
import type { ComponentType } from "react";

declare global {
  /** App 이 window 에서 찾아 그리는 화면 모듈 이름 */
  type ScreenName = "OverviewScreen" | "NodesScreen" | "DevicesScreen" | "DeploysScreen" | "AccessScreen" | "SettingsScreen" | "StatusScreen";

  interface Window {
    DS: typeof import("../../public-entry.js");
    KIT: typeof import("./data.js");
    /** 번들이 올린 네임스페이스. 프록시가 로드 순서에 상관없이 여기서 꺼낸다. */
    Ds_d3ea90?: typeof import("../../public-entry.js");
    React: typeof import("react");
    /** 화면 모듈은 IIFE 라 window 에 등록한다. App 이 이름으로 찾아 그린다. */
    DashboardApp: ComponentType<any>;
    OverviewScreen: ComponentType<any>;
    NodesScreen: ComponentType<any>;
    DevicesScreen: ComponentType<any>;
    DeploysScreen: ComponentType<any>;
    AccessScreen: ComponentType<any>;
    SettingsScreen: ComponentType<any>;
    StatusScreen: ComponentType<any>;
    /** 화면 모듈을 렌더 없이 로드하기 위한 빈 컴포넌트 */
    KitNoop: ComponentType<any>;
  }
  const React: typeof import("react");
}
export {};
