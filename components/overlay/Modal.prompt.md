Modal — 확인·오류 모달. 확인 버튼 라벨은 동사. 폼이 있으면 FormModal.

```jsx
<Modal open={!!err} onClose={()=>setErr(null)} title="명령이 처리되지 않았습니다" description={err?.detail}
  actions={<Button variant="primary" onClick={()=>setErr(null)}>확인</Button>} />
```
