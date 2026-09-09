MascotMark — 봉구(시츄+페키니즈) 마스코트 마크. 상태를 표정으로 전한다: 정상 smiling, 지연 worried, 끊김 crying, 연결 중 sleepy, 로딩 blank/neutral.

```jsx
<MascotMark face="smiling" size={26} animated={false} />
<MascotMark size={40} aria-label="봉구" />
```
- 얼굴은 `--mark-face/--mark-line/--mark-edge`, 귀는 `--mark-ear`(봉구 앰버 #99581F / 다크 #D08A4C — 실제 강아지 봉구 모티브, 시그널 파랑으로 바꾸지 않는다). `--text`를 쓰지 않는다.
- 옆 텍스트가 같은 뜻이면 aria-hidden(기본), 단독이면 aria-label.
