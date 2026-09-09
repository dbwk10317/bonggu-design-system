Inline · 가로 나열. 버튼 묶음·태그·메타 정보. 좁아지면 줄바꿈된다.

```jsx
<Inline><Button>취소</Button><Button variant="primary">저장</Button></Inline>
<Inline gap={3}>…</Inline>
<Inline justify="space-between" wrap={false}>…</Inline>
```
- gap을 주지 않으면 밀도 토큰 `--inline-gap`을 따른다. 특별한 이유가 없으면 주지 않는다.
