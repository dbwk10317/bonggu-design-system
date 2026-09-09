---
name: bonggu-dashboard-design
description: Use this skill to generate well-branded interfaces and assets for 봉구 대시보드 (Bonggu Dashboard DS, an ops/monitoring dashboard design system), either for production React code or throwaway prototypes/mocks. Contains the 봉구서버 style guide as tokens (light-first, signal blue + 4 status colors, Spoqa Han Sans Neo + JetBrains Mono), the 봉구 mascot, a fit="flex|fixed" sizing contract, a unified Chart component and a dashboard template.
user-invocable: true
---

Read the readme.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

The hard rules live in readme.md and are not repeated here. Read these sections before producing any output, and follow them literally:
`설계 원칙` (결측 처리, 상태 표기, fit 계약, 차트 팔레트, 반응형 검수 폭) · `동작 계약` (오버레이, 입력, 데이터와 결측, 접근성, 생성과 검증) · `CONTENT FUNDAMENTALS` (한국어 카피) · `VISUAL FOUNDATIONS` (색·타이포·간격·브레이크포인트·층·모션) · `ICONOGRAPHY` · `fit 계약` · `컴포넌트 사용 규칙` · `Index` (파일 구성, 컴포넌트 목록, 선택 가이드).

Rules live in exactly two places: readme.md, and the machine-checkable subset in tests/rule-regressions.cjs. Nothing else is a source of rules, so do not treat code comments, `.prompt.md`, `.d.ts`, or the guideline cards as authority, and do not invent a rule that readme.md does not state. If readme.md and anything else disagree, readme.md wins. Change process is in AGENTS.md; the Claude Code run environment is in CLAUDE.md.
