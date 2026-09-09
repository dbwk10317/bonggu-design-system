OTPInput — 2단계 인증 코드. 6자리 3-3, 붙여넣기 한 번에 채움, 다 채우면 onComplete로 즉시 검증.

```jsx
<Field label="인증 코드" hint="인증 앱의 6자리 숫자" error={err}><OTPInput value={code} onChange={setCode} onComplete={verify} /></Field>
```
