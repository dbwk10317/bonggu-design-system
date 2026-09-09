Drawer · 실행 상세·모델 상세처럼 "목록 옆에서 보는" 내용. 모달은 결정을 요구할 때만.

```jsx
<Drawer open={!!run} onClose={()=>setRun(null)} size="lg" title="학습 실행 상세" description={run?.id} actions={<Button variant="ghost" onClick={close}>닫기</Button>}>
  <Panel caption="실행 정보" padding="sm">…</Panel>
</Drawer>
```
- Esc·딤 클릭으로 닫힘. 768 미만은 전체 폭 시트.
- 패널은 네이티브 `<dialog class="bds-side__panel">`이고 showModal()로 열린다. 포커스가 패널 안에 갇히고, Esc는 cancel 이벤트로, 딤(패널 바깥) 클릭은 onClose를 부른다. 닫히면 열었던 요소로 돌아간다.
- 슬라이드 전환을 위해 `.bds-side` 래퍼(bds-side--open, bds-side--{size})가 닫힌 상태에서도 DOM에 남아 있다. 딤은 `::backdrop`이 아니라 `.bds-side__dim`.
