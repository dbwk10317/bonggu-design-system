FileUpload — 프로젝트 ZIP·Dataset ZIP 청크 업로드. 이미지 한 장은 Dropzone.

```jsx
<FileUpload accept=".zip" onFiles={start} onPause={pause} onResume={resume} onRetry={retry} onCancel={cancel} hint="ZIP · 최대 2 GiB · 페이지를 닫아도 서버 상태는 보존"
  items={[{id:"1",name:"ocr-finetune.zip",size:193e6,status:"uploading",progress:.44,chunk:4,chunks:9,rate:"42 MiB/s"},{id:"2",name:"asr.zip",size:8.1e8,status:"verifying"}]} />
```
- 업로드 로직(청크 PUT, SHA-256)은 컴포넌트 밖. 이 컴포넌트는 표시와 버튼만.
