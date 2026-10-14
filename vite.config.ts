/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 테스트(Vitest) 설정: 브라우저 대신 jsdom에서 컴포넌트를 렌더링합니다.
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
