Toast · 행동 결과 확인("두 장치에 적용했습니다."). 앱 루트에 ToastProvider 한 번, 화면에서 useToast().

```jsx
const { toast } = useToast();
toast({ message: "두 장치에 적용했습니다.", tone: "ok" });
toast({ message: "사진을 삭제했습니다.", action: "되돌리기", onAction: undo });
```
- action이 있거나 tone="crit"이면 닫기 전까지 남는다(duration을 직접 주면 그대로). crit은 role="alert", 그 외는 role="status".
- dismiss는 즉시 사라지지 않는다. 180ms 퇴장(`bds-toast--leaving`) 뒤에 목록에서 빠지며 그동안 클릭을 받지 않는다. reduced-motion이면 곧바로 제거한다. max는 퇴장 중인 것을 세지 않는다.
