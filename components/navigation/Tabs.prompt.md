Tabs — 한 화면 안의 뷰 전환(사용자 / 역할 / 할당). 페이지 이동은 사이드바.

```jsx
<Tabs aria-label="인증 콘솔" value={tab} onChange={setTab}
  items={[{value:"users",label:"사용자",count:12},{value:"roles",label:"역할",count:4},{value:"grants",label:"할당"}]} />
```
