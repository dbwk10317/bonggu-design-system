Stack · 세로 나열. 자식 사이 margin을 쓰지 않고 gap으로만 띄운다.

```jsx
<Stack gap={4}>…</Stack>           // 16px
<Stack gap={2} align="start">…</Stack>
```
- gap 번호는 --sp 스케일: 1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 7=32 · 8=40 · 9=48 · 10=64
- 카드 사이는 PageStack(--grid-gap), 카드 안 요소 사이는 Stack gap 2~3.
