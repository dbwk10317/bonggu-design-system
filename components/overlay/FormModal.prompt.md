FormModal · 입력 폼 모달(사용자 추가, 역할 편집). Enter로 제출, busy 중 잠금.

```jsx
<FormModal open={open} onClose={close} onSubmit={save} title="사용자 추가" submitLabel="추가" busy={saving}>
  <Field label="이름" required><TextField autoFocus /></Field>
  <Field label="이메일"><TextField type="email" /></Field>
</FormModal>
```
