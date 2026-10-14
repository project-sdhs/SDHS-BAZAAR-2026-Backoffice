/// <reference types="vite/client" />

// .env 파일의 VITE_ 로 시작하는 값들의 타입. 새 환경 변수를 만들면 여기에도 추가해요.
interface ImportMetaEnv {
  /** 백엔드 서버 주소 (예: http://localhost:3000) */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
