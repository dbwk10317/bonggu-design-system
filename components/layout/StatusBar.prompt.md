StatusBar · 셸 하단 28px 상태바. 항상 참인 값만(호스트·업타임·시계). live는 실시간 갱신 중일 때만. 한글 라벨은 그대로 넘기고 수치·시각만 `bds-mono`로 감쌉니다.

```jsx
<StatusBar
  live={{label:"실시간"}}
  items={["연결됨", <>업타임 <span className="bds-mono">12d 04:31</span></>]}
  right={[<>수집 주기 <span className="bds-mono">1s</span></>, <span className="bds-mono">18:42:07</span>]}
/>
```
