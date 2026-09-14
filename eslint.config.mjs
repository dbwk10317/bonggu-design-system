// Lints this repo's own React code (components/**). Not to be confused with _adherence.oxlintrc.json,
// which is generated and checks consumer apps' use of the design system.
// React usage rules live here, not in RULE.md, because they aren't design rules. Accessibility that needs
// judgement (focus order, keyboard flows) isn't caught statically; tests/README.md lists what the gate doesn't cover.
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    ignores: [
      // generated; fix the source and rebuild
      "_ds_bundle.js",
      "dist/**",
      "ds-bundle/**",
      ".ds-sync/**",
      ".design-sync/**",
      "node_modules/**",
      "tests/node_modules/**",
      // fixtures that break rules on purpose
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
    // jsx-a11y can't see inside custom components; tell it the rendered DOM element
    // (e.g. ConfirmDialog's <label><TextField/></label> already associates the input).
    settings: { "jsx-a11y": { components: { TextField: "input", TextArea: "textarea", Checkbox: "input", Select: "select", Button: "button", IconButton: "button", Link: "a" } } },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs["recommended-latest"].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // no-unused-vars doesn't understand JSX and flags identifiers used only there (e.g. <Icon/>);
      // these two mark them used. No other react-plugin rules are enabled.
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      // The gate passes warnings; rules meant to be enforced must be error.
      "react-hooks/exhaustive-deps": "error",
      // Only the roles RULE.md "접근성" says must take focus: application (navigation surface for drawn data;
      // without it browse mode steals the arrow keys) and region/log (clipped scroll areas, unreachable without
      // a mouse). jsx-a11y classes all three as structural, so only this documented set is opened.
      "jsx-a11y/no-noninteractive-tabindex": ["error", { tags: [], roles: ["tabpanel", "application", "region", "log"] }],
    },
  },
  {
    // Navigation surfaces for drawn data: RULE.md "접근성" requires role="application" + tabIndex=0 + a
    // role="status" readout. no-noninteractive-element-interactions can't allow per role (it only takes
    // handlers), so it is off for these two files only; tests/rule-regressions.cjs checks all three elements exist.
    files: ["components/data/Chart.jsx", "components/data/Heatmap.jsx"],
    rules: { "jsx-a11y/no-noninteractive-element-interactions": "off" },
  },
  {
    // combobox/listbox pattern: WAI-ARIA puts all keyboard handling on the single input (aria-activedescendant),
    // not on popup items; key handlers on items would handle the same key twice. Both rules assume "a click
    // handler needs a key handler", which doesn't fit. tests/browser-regressions.cjs presses these widgets' keys for real.
    files: ["components/input/Combobox.jsx", "components/input/MultiSelect.jsx", "components/navigation/CommandPalette.jsx"],
    rules: {
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
    },
  },
  {
    // Dashboard templates are screen modules read by the x-import loader: IIFEs registering on window, with
    // React as a script-tag global, so as ESM everything reads unused/undefined. They're assembly examples,
    // not product spec: hooks and a11y only.
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
