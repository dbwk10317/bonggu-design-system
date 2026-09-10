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
