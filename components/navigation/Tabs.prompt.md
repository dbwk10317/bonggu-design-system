Tabs · 한 화면 안의 뷰 전환(사용자 / 역할 / 할당). 페이지 이동은 사이드바.

```jsx
<Tabs aria-label="인증 콘솔" value={tab} onChange={setTab} panelId={(v)=>`auth-panel-${v}`}
  items={[{value:"users",label:"사용자",count:12},{value:"roles",label:"역할",count:4},{value:"grants",label:"할당"}]} />
<div id={`auth-panel-${tab}`} role="tabpanel">…</div>
```
- 선택 탭만 Tab 키 순서에 들어가고, 화살표·Home·End가 선택과 포커스를 함께 옮긴다.
- panelId를 주면 각 탭에 aria-controls가 붙는다. 패널 쪽 id는 소비자가 같은 규칙으로 붙인다.
