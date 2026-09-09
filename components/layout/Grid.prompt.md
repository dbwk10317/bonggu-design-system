Grid · 카드 격자. 화면별 CSS에 격자를 다시 쓰지 않는다.

```jsx
<Grid cols={3}>…</Grid>                      // auto-fit: 폭에 따라 3 → 2 → 1열
<Grid min={220}>…</Grid>                     // 카드 최소 폭 직접 지정
<Grid columns={12}>                          // 고정 12열 + span(비대칭 배치)
  <GridItem span={8} spanMd={12}><Panel>넓은 차트</Panel></GridItem>
  <GridItem span={4} spanMd={12}><Panel>요약</Panel></GridItem>
</Grid>
```

- 접힘 기준은 뷰포트가 아니라 격자 자신의 폭(컨테이너 쿼리): span ≥900 · spanMd <900 · spanSm <640 · <480 전폭.
