Heatmap · 시간×요일 요청량, GPU 사용 패턴 같은 2차원 강도. 색은 순차 램프(--ramp)만, 값은 hover 시 아래 줄에 텍스트로.

```jsx
<Heatmap aria-label="요일·시간별 요청량" rows={["월","화","수","목","금","토","일"]} cols={Array.from({length:24},(_,h)=>`${h}시`)} values={matrix} valueFormatter={(v)=>`${v}건`} />
```
- 셀은 부모 폭에 맞춰 늘어난다(fit="flex"). 열 라벨은 폭에 따라 자동으로 건너뛴다.
- 상태색(ok/warn/crit)을 셀에 쓰지 않는다. 임계는 값 텍스트로.
- 값이 `null`·`undefined`·`NaN`인 칸은 점선 빈 칸이고, 값 텍스트와 숨김 표에는 "수집 안 됨"이 들어간다.
- 격자에 포커스(Tab)한 뒤 화살표로 셀을 옮기면 hover와 같은 값 텍스트가 아래 줄에 뜬다(Esc 해제). 같은 데이터가 숨김 표로 aria-describedby에 연결된다.
