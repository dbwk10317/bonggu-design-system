MascotMark · 봉구(시츄+페키니즈) 마스코트 마크. 상태를 표정으로 전한다: 정상 smiling, 지연 worried, 끊김 crying, 연결 중 sleepy, 로딩 blank/neutral.

```jsx
<MascotMark face="smiling" size="md" animated={false} />
<MascotMark size="lg" aria-label="봉구" />
```
- 얼굴은 `--mark-face/--mark-line/--mark-edge`, 귀는 `--mark-ear`(봉구 앰버 #99581F / 다크 #D08A4C · 실제 강아지 봉구 모티브, 시그널 파랑으로 바꾸지 않는다). `--text`를 쓰지 않는다.
- 옆 텍스트가 같은 뜻이면 aria-hidden(기본), 단독이면 aria-label.

- 크기: `xxs` 16 · `xs` 24 · `sm` 32 · `md` 48(기본) · `lg` 64 · `xl` 96 · `xxl` 128px. 대문자 이름도 지원하며 기존 `size={26}` 등 숫자 지정은 유지됩니다.
- 넓은 흰 이마, 비대칭 눈가 무늬, 긴 갈색 귀, 짧은 주둥이를 단색 SVG로 표현합니다. 20px 이하에서는 눈 반짝임을 생략하고 기본 얼굴을 권장합니다. 표정은 24px 이상에서 사용합니다.
- 표정 8종과 `blank`를 유지합니다. 기본 얼굴의 눈 깜빡임과 호버 귀 움직임은 `animated`로 제어하며 reduced-motion 설정을 따릅니다.
