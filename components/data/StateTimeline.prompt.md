StateTimeline · 여러 대상의 상태 지속 시간을 같은 시간축으로 비교합니다. 결측·중첩·좁은 구간의 읽을거리는 RULE.md의 "탐색·작업 확장 계약"을 따릅니다.

```jsx
<StateTimeline rows={[{id:"api",label:"인증 API",intervals:[
  {id:"healthy",start:startedAt,end:incidentAt,status:"ok",label:"정상"},
  {id:"incident",start:incidentAt,end:recoveredAt,status:"warn",label:"응답 지연"}
]}]} from={windowStart} to={windowEnd} />
```

시간은 숫자 좌표이며 기본 포맷은 epoch 밀리초를 시각으로 표시합니다. 다른 단위는 `formatTime`으로 표시합니다. `height`는 내부 탐색 영역 높이입니다. 화살표·Home·End로 구간을 선택하고 Esc로 해제합니다.
