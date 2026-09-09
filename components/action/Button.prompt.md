Button · 행동을 일으키는 버튼. 한 화면에 primary는 하나, 파괴적 행동은 danger, 보조는 ghost.

```jsx
<Button variant="primary" icon="check" onClick={apply}>적용</Button>
<Button variant="secondary">소등</Button>
<Button variant="ghost" size="sm">+ 색 추가</Button>
<Button variant="danger" busy>삭제 중</Button>
<Button fit="flex">모바일 전폭</Button>
```

- variant: primary | secondary(기본) | ghost | danger
- size: sm(28px) | md(32px) | lg(40px). 터치 기기(pointer:coarse)에서는 36/44/48로 자동 승격
- fit: auto(기본) | flex(부모 폭) | fixed(width)
- busy: 스피너 + 비활성. 라벨은 동사로("적용", "저장", "삭제").
