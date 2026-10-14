import { Navigate, type RouteObject } from 'react-router'
import AdminLayout from '../layouts/AdminLayout'
import DashboardPage from '../pages/DashboardPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import { PATHS } from './paths'

/**
 * 라우트 표. 새 화면을 만들면
 * 1) pages/ 에 XxxPage.tsx 를 만들고 2) paths.ts 에 주소를 추가한 뒤 3) 여기에 등록해요.
 * 관리자 화면은 AdminLayout 의 children 에 넣으면 헤더·사이드바가 함께 보여요.
 */
export const routes: RouteObject[] = [
  { path: PATHS.root, element: <Navigate to={PATHS.login} replace /> },
  { path: PATHS.login, element: <LoginPage /> },
  {
    element: <AdminLayout />,
    children: [{ path: PATHS.dashboard, element: <DashboardPage /> }],
  },
  { path: '*', element: <NotFoundPage /> },
]
