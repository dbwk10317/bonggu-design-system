OTPInput · 2단계 인증 코드. 6자리 3-3, 붙여넣기 한 번에 채움, 다 채우면 onComplete로 즉시 검증.

```jsx
<Field label="인증 코드" hint="인증 앱의 6자리 숫자" error={err}><OTPInput value={code} onChange={setCode} onComplete={verify} /></Field>
```

- 부분 value/onChange도 자릿수를 보존한다. 중간 빈칸은 ASCII 공백이고 말미 빈칸만 생략한다. 예: `123456`의 세 번째 칸 삭제 → `12 456`, `9` 입력 → `129456`. 부모는 공백을 제거하지 않고 value를 그대로 돌려준다.
- 마이그레이션: 부분값이 숫자만 있다는 가정은 제거한다. 모든 자리가 숫자인 완성값만 onComplete로 전달되므로 인증 요청은 onComplete에서 수행한다. 외부 value 초기화는 그대로 화면에 반영된다.
