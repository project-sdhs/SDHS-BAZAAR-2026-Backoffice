// 모든 테스트 전에 한 번 실행되는 파일 (vite.config.ts 의 test.setupFiles)
import '@testing-library/jest-dom/vitest' // toBeInTheDocument() 같은 DOM 전용 expect 추가
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// 테스트마다 렌더링한 화면을 지워서 서로 영향을 주지 않게 합니다.
afterEach(() => {
  cleanup()
})
