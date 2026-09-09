Popover · 클릭으로 열리는 작은 패널. 설명 + 링크, 열 표시 토글 같은 미니 폼. 텍스트 한 줄 설명은 Tooltip, 행 동작 목록은 DropdownMenu.

```jsx
<Popover trigger={<IconButton icon="info" aria-label="임계 설명" size="sm" variant="ghost" />} title="임계 기준">0~70 정상 · 70~90 주의 · 90 이상 위험</Popover>
```
- Esc로 닫히면 포커스가 트리거로 돌아간다.
