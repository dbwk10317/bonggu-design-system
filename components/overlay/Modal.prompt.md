Modal · 확인·오류 모달. 확인 버튼 라벨은 동사. 폼이 있으면 FormModal.

```jsx
<Modal open={!!err} onClose={()=>setErr(null)} title="명령이 처리되지 않았습니다" description={err?.detail}
  actions={<Button variant="primary" onClick={()=>setErr(null)}>확인</Button>} />
```
- 네이티브 `<dialog>`를 showModal()로 열어 포커스가 모달 안에 갇히고, 닫히면 열었던 요소로 돌아간다. Esc는 dialog의 cancel 이벤트로, 딤(패널 바깥) 클릭은 mousedown으로 onClose를 부른다(onClose가 없으면 닫히지 않는다).
- open일 때만 렌더된다. 패널 자체가 `<dialog class="bds-modal__panel">`이고 딤은 `::backdrop`이다.

- size는 패널 자체의 modifier로 적용된다(sm 360, md 440, lg 560, xl 760px). 640px 미만에서는 모두 전체 폭이다. 중첩 Modal·Drawer가 모두 닫혀야 본문 스크롤 잠금이 해제된다.
