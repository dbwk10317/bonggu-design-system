DropdownMenu · 표 행의 3번째 이후 액션. 주 액션 1개는 버튼으로 남기고 나머지를 접는다.

```jsx
<DropdownMenu items={[
  {label:"관리", icon:"gear-six", onSelect:()=>edit(m)},
  {label:"호출 예시 복사", icon:"copy", onSelect:copyCurl},
  "-",
  {label:"목록에서 제거", icon:"trash", danger:true, onSelect:()=>unregister(m)}]} />
<DropdownMenu trigger={<Button variant="secondary" icon="caret-down">내보내기</Button>} items={[...]} />
```
- ↑↓ Enter Esc, 바깥 클릭으로 닫힘. align은 선호 정렬이며 뷰포트 안으로 자동 보정한다. 아래 공간이 부족하면 위로 연다.
- Home/End로 양끝 이동, Tab이면 닫힘. Esc·선택으로 닫히면 포커스가 트리거로 돌아간다.
- 네이티브 Popover API의 top layer를 사용한다. 표의 overflow를 변경하지 않으며, dialog 안에서도 DOM 소속과 테마 상속을 유지한다. Popover API를 지원하는 브라우저가 필요하다.
- 메뉴 스크롤은 메뉴 안에서 처리한다. 트리거 주변 스크롤·창 크기 변경 시 위치를 다시 계산한다. Esc는 메뉴만 닫고 부모 모달은 유지한다.
