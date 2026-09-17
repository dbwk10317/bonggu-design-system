LogViewer · 학습·명령 로그. mono, 레벨별 색, follow로 자동 스크롤. 높이는 height(기본 240).

```jsx
<LogViewer height={220} lines={[{level:"info",time:"18:42:01",text:"epoch 3/10 loss=0.412"},{level:"warn",time:"18:42:09",text:"VRAM 여유 1.2 GiB"}]} />
```

`fit="auto"`와 `width`를 함께 넘겨 콘텐츠 배치에 맞춘 폭을 지정할 수 있습니다. 크기 계약은 RULE.md를 따릅니다.

`searchable`을 켜면 검색·레벨 필터·이전/다음 결과·따라가기 도구가 나옵니다. 스트림이 고정 길이 버퍼를 교체하면 각 행에 안정적인 `id`를 주어 새 로그 건수를 이어갑니다.

```jsx
<LogViewer searchable lines={lines} follow aria-label="서비스 로그" />
```
