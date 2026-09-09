EmptyState · 목록·차트가 비었을 때. 봉구 표정(curious 기본, error면 worried) + 제목 + 다음 행동.

```jsx
<EmptyState title="아직 기록된 모델 요청이 없습니다." description="허브로 추론 요청이 오면 여기에 쌓입니다." />
<EmptyState tone="error" title="GPU 예약 회계를 읽지 못했습니다." actions={<Button size="sm">다시 시도</Button>} />
```
