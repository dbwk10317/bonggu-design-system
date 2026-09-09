Tooltip · 아이콘 버튼의 이름, 잘린 식별자의 전문. 짧은 텍스트만.

```jsx
<Tooltip content="다크 테마로"><IconButton icon="moon" variant="ghost" aria-label="다크 테마로" /></Tooltip>
<Tooltip content="bgt_9f2c1e7a4b8d3f60" side="bottom"><span className="bds-mono bds-ellipsis">bgt_9f2c…</span></Tooltip>
```
- 자식은 하나. aria-describedby를 자동 연결한다. Esc·blur·mouseleave로 닫힌다. 모바일(터치)에서는 뜨지 않으니 필수 정보는 화면에 두어라.
- 최대 폭 280px(뷰포트의 90%까지)에서 줄바꿈된다. 한 줄 문구에 맞추고 긴 설명은 Popover.
