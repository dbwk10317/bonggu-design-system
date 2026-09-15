TopNav · 화면이 5개 이하인 작은 도구는 레일 대신 상단 내비. 활성은 signal-tint 배경.

```jsx
<TopNav skipTo="main" brand={{name:"봉구 대시보드"}} links={[{label:"상태",icon:"pulse",active:true},{label:"설정",icon:"gear-six"}]} end={<Avatar name="이지훈" size="sm" />} />
<main id="main" tabIndex={-1}>…</main>
```
- 본문 요소에 `id`와 `tabIndex={-1}`을 주고 그 id를 `skipTo`로 넘긴다.
