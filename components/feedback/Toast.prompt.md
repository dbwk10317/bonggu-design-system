Toast — 행동 결과 확인("두 장치에 적용했습니다."). 앱 루트에 ToastProvider 한 번, 화면에서 useToast().

```jsx
const { toast } = useToast();
toast({ message: "두 장치에 적용했습니다.", tone: "ok" });
toast({ message: "사진을 삭제했습니다.", action: "되돌리기", onAction: undo });
```
