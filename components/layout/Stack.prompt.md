Stack · 세로 나열. 자식 사이 margin을 쓰지 않고 gap으로만 띄운다.

```jsx
<Stack gap={4}>…</Stack>           // 16px
<Stack gap={2} align="start">…</Stack>
```
- gap 번호는 --sp 스케일: 1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 7=32 · 8=40 · 9=48 · 10=64
- 기본은 gap 4(16px)다. 카드 사이는 PageStack(--grid-gap), 한 덩어리 안의 촘촘한 보조 정보만 gap 1~3을 명시한다.
