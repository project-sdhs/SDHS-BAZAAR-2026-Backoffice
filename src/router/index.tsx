import { createBrowserRouter } from 'react-router'
import { routes } from './routes'

/** 앱 전체에서 쓰는 라우터 (react-router v7, 브라우저 주소창 기준) */
export const router = createBrowserRouter(routes)
