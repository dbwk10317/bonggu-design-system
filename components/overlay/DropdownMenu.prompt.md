DropdownMenu · 표 행의 3번째 이후 액션. 주 액션 1개는 버튼으로 남기고 나머지를 접는다.

```jsx
<DropdownMenu items={[
  {label:"관리", icon:"gear-six", onSelect:()=>edit(m)},
  {label:"호출 예시 복사", icon:"copy", onSelect:copyCurl},
  "-",
  {label:"목록에서 제거", icon:"trash", danger:true, onSelect:()=>unregister(m)}]} />
<DropdownMenu trigger={<Button variant="secondary" icon="caret-down">내보내기</Button>} items={[...]} />
```
- ↑↓ Enter Esc, 바깥 클릭으로 닫힘. 폭이 좁으면 align="start"로.
- Home/End로 양끝 이동, Tab이면 닫힘. Esc·선택으로 닫히면 포커스가 트리거로 돌아간다.
