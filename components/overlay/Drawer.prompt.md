Drawer — 실행 상세·모델 상세처럼 "목록 옆에서 보는" 내용. 모달은 결정을 요구할 때만.

```jsx
<Drawer open={!!run} onClose={()=>setRun(null)} size="lg" title="학습 실행 상세" description={run?.id} actions={<Button variant="ghost" onClick={close}>닫기</Button>}>
  <Panel caption="실행 정보" padding="sm">…</Panel>
</Drawer>
```
- Esc·딤 클릭으로 닫힘. 768 미만은 전체 폭 시트.
