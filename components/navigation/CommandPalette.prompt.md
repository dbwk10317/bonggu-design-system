CommandPalette · ⌘K/Ctrl+K로 여는 화면 이동·명령 검색. 열기 단축키 바인딩은 앱이 한다. 그룹은 "화면", "동작" 두 개 정도.

```jsx
<CommandPalette open={open} onClose={()=>setOpen(false)} items={[
  {id:"mon",label:"모니터링",icon:"pulse",group:"화면",onSelect:()=>go("/")},
  {id:"restart",label:"ai-hub 재시작",icon:"arrow-clockwise",group:"동작",hint:"확인 필요"}]} />
```
- 모달 dialog라 열면 포커스가 안에 갇히고, 닫히면 열기 전 요소로 돌아간다. 항목은 Tab 순서에 들지 않고 ↑↓ Enter로만 고른다.
- `onSelect`는 팔레트가 닫힌 뒤에 불린다. 포커스를 옮기는 명령도 그대로 쓸 수 있다.
