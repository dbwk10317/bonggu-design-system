Chart · 모든 차트는 이 하나로. kind가 표현을 정하고 격자·축·범례·툴팁·빈 상태는 공유한다. 색은 --series-1~8(같은 명도·채도), 상태 의미는 label 텍스트로.

```jsx
<Chart kind="area" aria-label="네트워크 처리량" height={180} labels={ticks}
  series={[{label:"수신",tone:"rx",values:rx},{label:"송신",tone:"tx",values:tx}]} valueFormatter={v => `${v} Mb/s`} />
<Chart kind="bar" labels={days} series={[{label:"요청",values:req},{label:"오류",tone:5,values:err}]} stacked />
<Chart kind="line" labels={t} series={[{label:"CPU 온도",values:temp}]} thresholds={[{value:75,label:"위험 75°C",tone:"crit"}]} />
<Chart kind="radial" value={0.62} label="정상" tone="ok" valueFormatter={v => `${Math.round(v*100)}%`} fit="fixed" width={130} height={100} />
<Chart kind="pie" segments={[{label:"모델",value:9.2},{label:"학습",value:4.1},{label:"여유",value:2.7,tone:6}]} caption="GiB" />
<Chart kind="radar" axes={["CPU","GPU","메모리","디스크","네트워크"]} series={[{label:"지금",values:[62,30,71,48,12]}]} max={100} />
```
- fit="flex"(기본): 부모 폭을 채우고 height만 정한다. 격자 카드 안에서 저절로 맞는다.
- fit="fixed" width height: 고정 상자(미터·아이콘형 게이지).
- 결측 판정과 종류별 생략 방식, 누적 규칙은 readme.md를 따른다. 값이 하나도 없으면 빈 상태 문구가 나온다.
- 단위가 다른 계열은 한 차트에 겹치지 않는다.
- live: 스트림 갱신 차트. 진입 그리기 모션을 끄고 값이 즉시 바뀐다. paused={true}면 마지막 props 스냅샷을 그대로 그려 화면을 멈추고, false로 돌리면 최신 값으로 따라잡는다.
- line·area는 계열이 3개 이상이면 실선 · "6 4" · "2 4" · "8 3 2 3" 순으로 dash가 자동 순환한다(색만으로 구분하지 않는다). 계열의 dash로 직접 주거나 dash={false}로 실선 고정.
- 키보드: stage가 tabIndex=0이라 Tab으로 들어가 ←/→로 인덱스 이동, Home/End 양끝, Esc로 해제. 마우스 hover와 같은 툴팁이 뜬다.
- 접근성: 같은 데이터의 숨김 표(bds-sr)가 항상 렌더되어 루트(role="img")에 aria-describedby로 연결된다. aria-label로 무엇의 차트인지 적는다.
- tone: 범주형 1~8(순서 고정, 9개 이상은 "기타"), 의미 고정 쌍 "rx"/"tx"(수신·송신, 읽기·쓰기) "used"/"reserved"/"free"(VRAM), 미터 임계 "ok"/"warn"/"crit"(radial: 0~70 정상 · 70~90 주의 · 90~ 위험, 값 텍스트도 같은 상태 잉크). 상태색을 범주 시리즈로 쓰지 않는다.
- kind="histogram": 응답시간 분포. `<Chart kind="histogram" aria-label="응답시간 분포" samples={latencies} unit="ms" percentiles={[0.5,0.95]} tone={1} />` · 구간 수는 자동(√n), p50/p95는 세로 점선 + 라벨.
