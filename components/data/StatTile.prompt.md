StatTile — 큰 수치 하나(활성 모델 3개, 요청 12,480건). 숫자면 mono+카운트업, delta로 증감, spark로 추세.

```jsx
<div className="bds-metric-grid">
  <StatTile label="요청" value={12480} unit="건" delta={+320} deltaLabel="지난 1시간" spark={[3,5,4,8,9,7,12]} />
  <StatTile label="평균 응답" value={184} unit="ms" digits={0} delta={-12} />
  <StatTile label="프로세스 자동 제어" value="사용 중" flat />
</div>
```

허전하지 않게: 수치 하나만 두지 말고 detail(무엇이 3개인지: Tag 나열)·pill(상태)·spark(추세) 중 하나 이상을 붙인다.
```jsx
<StatTile icon="cube" label="활성 모델" value={3} unit="개" pill={{tone:"ok",text:"실행 중"}} spark={[2,2,3,3,2,3,3]}
  detail={<><Tag>ko-embed-v3</Tag><Tag>whisper-large</Tag><Tag>llama-3.1-8b</Tag></>} />
<StatTile icon="robot" label="프로세스 자동 제어" value="사용 중" pill={{tone:"ok",text:"host agent"}} detail={<>heartbeat <span className="bds-mono">4초 전</span> · 자동 시작 2 · 자동 종료 1</>} />
```
