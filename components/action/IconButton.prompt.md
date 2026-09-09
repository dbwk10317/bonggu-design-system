IconButton · 아이콘만 있는 28~40px 정방형 버튼. aria-label 필수. 알림 종처럼 카운트가 필요하면 badge.

```jsx
<IconButton icon="bell" aria-label="알림" badge={3} />
<IconButton icon="x" aria-label="닫기" variant="ghost" size="sm" />
<IconButton icon="trash" aria-label="삭제" variant="danger" />
```
- badge가 0보다 크면 접근 가능한 이름이 "aria-label, N건"으로 합쳐진다(99 초과는 "99+건"). aria-label에 숫자를 직접 넣지 않는다.
