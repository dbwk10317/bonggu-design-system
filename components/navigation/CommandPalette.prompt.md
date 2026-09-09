CommandPalette — ⌘K/Ctrl+K로 여는 화면 이동·명령 검색. 열기 단축키 바인딩은 앱이 한다. 그룹은 "화면", "동작" 두 개 정도.

```jsx
<CommandPalette open={open} onClose={()=>setOpen(false)} items={[
  {id:"mon",label:"모니터링",icon:"pulse",group:"화면",onSelect:()=>go("/")},
  {id:"restart",label:"ai-hub 재시작",icon:"arrow-clockwise",group:"동작",hint:"확인 필요"}]} />
```
