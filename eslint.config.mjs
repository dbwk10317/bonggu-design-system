// components/** 의 React 코드를 검사한다. 이 저장소가 자기 코드를 보는 유일한 린트다.
// _adherence.oxlintrc.json 과 헷갈리지 않도록: 그쪽은 생성물이고, 소비자 앱이 디자인 시스템을
// 제대로 쓰는지 보는 규칙이다(토큰 사용, 내부 경로 import 금지). 이 파일은 라이브러리 자신을 본다.
//
// 규칙은 readme.md 가 아니라 여기 있다. 디자인 규칙이 아니라 React 사용 규칙이기 때문이다.
// 접근성 규칙 중 판단이 필요한 것(초점 순서, 키보드 조작 흐름)은 정적 검사로 가려지지 않으므로
// tests/README.md 의 게이트 범위에 무엇이 덮이지 않는지 적어 둔다.
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    ignores: [
      // 생성물. 소스를 고치고 다시 만든다.
      "_ds_bundle.js",
      "dist/**",
      "ds-bundle/**",
      ".ds-sync/**",
      ".design-sync/**",
      "node_modules/**",
      "tests/node_modules/**",
      // 검사 대상이 되도록 일부러 규칙을 어긴 픽스처
      "tests/fixtures/**",
    ],
  },
  {
    files: ["components/**/*.{js,jsx}", "public-entry.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    // jsx-a11y 는 커스텀 컴포넌트 안을 보지 못한다. 어떤 DOM 요소로 그려지는지 알려 준다.
    // 예: ConfirmDialog 의 <label><TextField/></label> 은 input 이 label 안에 있어 이미 연결돼 있다.
    settings: { "jsx-a11y": { components: { TextField: "input", TextArea: "textarea", Checkbox: "input", Select: "select", Button: "button", IconButton: "button", Link: "a" } } },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs["recommended-latest"].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // no-unused-vars 는 JSX 를 모른다. <Icon/> 처럼 JSX 에서만 쓰는 식별자를
      // 미사용으로 잡으므로 이 두 규칙으로 사용 표시를 해 준다. react 플러그인의 나머지 규칙은 켜지 않는다.
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      // 게이트는 경고를 통과시킨다. 지킬 규칙이면 error 로 둔다.
      "react-hooks/exhaustive-deps": "error",
      // readme.md 접근성 절: 그림으로 그리는 데이터의 탐색 표면은 role="application" + tabIndex=0 이다.
      // 역할이 없으면 스크린리더 브라우즈 모드가 화살표를 먼저 가져가 탐색이 동작하지 않는다.
      // jsx-a11y 는 application 을 구조 역할로 분류하므로 문서화된 이 조합만 허용한다.
      "jsx-a11y/no-noninteractive-tabindex": ["error", { tags: [], roles: ["tabpanel", "application"] }],
    },
  },
  {
    // 그림으로 그리는 데이터의 탐색 표면. readme.md 접근성 절이 role="application" + tabIndex=0 +
    // role="status" 읽을거리를 규정한다. no-noninteractive-element-interactions 는 역할별 허용을
    // 표현할 수단이 없어(handlers 만 받는다) 이 두 파일에서만 끈다. 규칙 자체는 readme 에 있고
    // tests/rule-regressions.cjs 가 세 요소가 모두 있는지 검사한다.
    files: ["components/data/Chart.jsx", "components/data/Heatmap.jsx"],
    rules: { "jsx-a11y/no-noninteractive-element-interactions": "off" },
  },
  {
    // combobox·listbox 패턴. WAI-ARIA 는 키보드를 입력 하나에 모으고(aria-activedescendant)
    // 팝업 항목에는 두지 않는다. 항목에 키 핸들러를 달면 오히려 두 곳이 같은 키를 처리한다.
    // 두 규칙은 "클릭 핸들러 옆에 키 핸들러가 있어야 한다"를 전제하므로 이 패턴과 맞지 않는다.
    // 해당 위젯의 키보드 조작은 tests/browser-regressions.cjs 가 실제로 눌러 확인한다.
    files: ["components/input/Combobox.jsx", "components/input/MultiSelect.jsx", "components/navigation/CommandPalette.jsx"],
    rules: {
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
    },
  },
  {
    // 대시보드 템플릿은 x-import 로더가 읽는 화면 모듈이다. ESM 이 아니라 IIFE 로 window 에 등록하고
    // React 도 script 태그로 들어온 전역이라, 모듈 기준으로 보면 전부 미사용·미정의로 잡힌다.
    // 제품 사양이 아니라 조립 예시이므로 훅·접근성만 본다.
    files: ["templates/**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "script",
      globals: { ...globals.browser, React: "readonly" },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "react/jsx-uses-vars": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
];
