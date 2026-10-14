import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { PATHS } from './paths'
import { routes } from './routes'

/** 브라우저 주소창 대신 메모리 라우터로 원하는 주소에서 앱을 띄웁니다. */
function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

describe('라우터', () => {
  it('/login 에서 로그인 화면을 보여준다', () => {
    renderAt(PATHS.login)

    expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByText('준비 중')).toBeInTheDocument()
  })

  it('/ 로 들어오면 /login 으로 이동한다', async () => {
    const router = renderAt(PATHS.root)

    expect(
      await screen.findByRole('heading', { name: '로그인' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(PATHS.login)
  })

  it('/dashboard 는 관리자 레이아웃(사이드바) 안에 보인다', () => {
    renderAt(PATHS.dashboard)

    expect(
      screen.getByRole('navigation', { name: '관리자 메뉴' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '대시보드' }),
    ).toBeInTheDocument()
  })

  it('없는 주소는 404 화면을 보여준다', () => {
    renderAt('/no-such-page')

    expect(
      screen.getByRole('heading', { name: '페이지를 찾을 수 없어요' }),
    ).toBeInTheDocument()
  })
})
