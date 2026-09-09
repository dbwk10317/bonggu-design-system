---
name: bonggu-dashboard-design
description: 봉구 대시보드 디자인 시스템. 운영·모니터링 대시보드의 화면·컴포넌트·시안을 만들 때 씁니다. Use when building or designing an ops/monitoring dashboard in the 봉구 brand, as production React or as a throwaway static HTML mock. Light-first tokens, one signal blue plus four status colours, Spoqa Han Sans Neo and JetBrains Mono, the 봉구 mascot, a fit sizing contract, one Chart component, 96 components and a full dashboard template.
user-invocable: true
---

# 봉구 대시보드 디자인 시스템

규칙은 [readme.md](readme.md) 한 곳에 있습니다. 무엇을 만들든 먼저 전부 읽고 거기 적힌 대로만 만듭니다. readme.md에 없는 규칙은 새로 만들지 않고, 다른 파일이 규칙처럼 읽히면 readme.md가 기준입니다.

## 어디를 보는가

- 컴포넌트 쓰는 법 · `components/<그룹>/<이름>.prompt.md`와 같은 이름의 `.d.ts`
- 눈으로 확인 · `guidelines/index.html`(컴포넌트와 값을 한 페이지에서 보는 가이드), `guidelines/*.html`(값 카드), `components/*/*.card.html`(그룹별 카드)
- 조립 예시 · `templates/dashboard/`(가상 제품 하나를 이 시스템의 컴포넌트만으로 조립한 대시보드)
- 고칠 때의 원칙 · [AGENTS.md](AGENTS.md) · 실행 환경과 빌드·검증 명령 · [CLAUDE.md](CLAUDE.md)

## 무엇을 내놓는가

- **시안·프로토타입**: 필요한 자산을 복사해 정적 HTML 한 장으로 만듭니다. `components/*/*.card.html`이 그대로 본보기입니다(React UMD + `_ds_bundle.js` + `styles.css`).
- **제품 코드**: 소비 프로젝트에 `styles.css`와 컴포넌트를 붙여 씁니다. 템플릿을 복사해 쓸 때는 `ds-base.js`의 `base` 한 줄만 고칩니다.
- 지시 없이 스킬만 부르면 무엇을 만들지, 어떤 화면인지 먼저 묻고 시작합니다.
