Timeline · 시간순 이벤트. KeyValues 나열 대신 "언제 무엇이" 한눈에.

```jsx
<Timeline aria-label="최근 운영 변화" items={[
  {time:"18:40:12", tone:"ok", icon:"play", title:"ko-embed-v3 실행 중", detail:"lease granted → active · 3.0 GiB"},
  {time:"17:02:44", tone:"off", icon:"stop", title:"whisper-large 종료됨"},
  {time:"16:49:58", tone:"warn", icon:"hourglass", title:"ko-rerank 대기 중", detail:"VRAM 확보 대기"}]} />
```
- time은 mono, 최신이 위. tone은 점 색만 바꾸고 텍스트가 뜻을 전한다.
- tone(ok·warn·crit·info)은 제목 앞에 스크린리더용 "정상,"/"주의," 같은 텍스트로도 읽힌다.
