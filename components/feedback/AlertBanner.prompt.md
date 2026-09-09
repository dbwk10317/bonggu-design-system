AlertBanner — 남아 있어야 하는 페이지·섹션 알림(수집 실패, 미구성, 대기열). 일시 알림은 토스트.

```jsx
<AlertBanner tone="warn" title="조명 제어가 서버에서 구성되지 않았습니다.">MQTT 계정 설정 후 사용할 수 있습니다.</AlertBanner>
<AlertBanner tone="crit" title="AI 허브 상태를 불러오지 못했습니다." onClose={..} />
```
