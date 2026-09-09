ErrorState · 카드 하나가 실패해도 페이지는 살린다(degraded). 원인은 한 문장, 코드는 mono. 결측 값 하나는 "수집 안 됨" 텍스트로 충분하고 ErrorState는 카드 전체가 실패했을 때만.

```jsx
<Panel><ErrorState description="monitoring-api가 응답하지 않습니다." code="HTTP 502 · req_8f2a" onRetry={refetch} /></Panel>
```
