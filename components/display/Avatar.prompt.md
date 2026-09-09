Avatar · 사용자(인증 화면)·서비스 아이콘 자리. 사진 없으면 이니셜. 색은 중성(panel-3) 하나, 사용자별 랜덤색 금지.

```jsx
<Avatar name="이지훈" status="ok" />
<AvatarGroup users={[{name:"이지훈"},{name:"Kim"},{name:"박서연"},{name:"A"},{name:"B"}]} max={3} />
```
- status를 주면 접근 가능한 이름이 "이름, 정상/주의/위험/오프라인"이 된다.
