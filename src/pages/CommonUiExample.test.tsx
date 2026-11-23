import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CommonUiExample from './CommonUiExample'

describe('회원 관리 디자인 미리보기', () => {
  it('요약과 회원 표, 직접 지정 패널을 한 화면에 보여준다', () => {
    render(<CommonUiExample />)
    expect(
      screen.getByRole('heading', { name: '반 · 회원 관리' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: '회원 요약' }),
    ).toBeInTheDocument()
    expect(
      within(screen.getByRole('table', { name: '회원 목록' })).getAllByRole(
        'row',
      ),
    ).toHaveLength(11)
    expect(
      screen.getByRole('complementary', { name: '직접 지정' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('비활성화 상태')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '성공 알림 보기' }),
    ).not.toBeInTheDocument()
  })

  it('변경한 임시 학번으로 검색하고 초기화할 수 있다', () => {
    render(<CommonUiExample />)
    fireEvent.change(screen.getByRole('searchbox', { name: '회원 검색' }), {
      target: { value: '20317' },
    })
    const table = within(screen.getByRole('table', { name: '회원 목록' }))
    expect(table.getByRole('button', { name: '정태훈' })).toBeInTheDocument()
    expect(table.queryByText('정하늘')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1–1 / 1명')
    fireEvent.click(screen.getByRole('button', { name: '회원 검색 지우기' }))
    expect(screen.getByRole('status')).toHaveTextContent('1–10 / 10명')
  })

  it('학년, 반, 역할 필터를 함께 적용할 수 있다', () => {
    render(<CommonUiExample />)
    const grades = within(screen.getByRole('group', { name: '학년 선택' }))
    fireEvent.click(grades.getByRole('radio', { name: '2학년' }))
    fireEvent.click(screen.getByRole('button', { name: '반장' }))
    expect(screen.getByRole('status')).toHaveTextContent('1–2 / 2명')
    fireEvent.change(screen.getByRole('combobox', { name: '반 선택' }), {
      target: { value: '3' },
    })
    expect(screen.getByRole('status')).toHaveTextContent('1–1 / 1명')
    const table = within(screen.getByRole('table', { name: '회원 목록' }))
    expect(table.getByRole('button', { name: '정태훈' })).toBeInTheDocument()
    expect(table.queryByText('카피바라')).not.toBeInTheDocument()
  })

  it('빈 검색 결과와 확인 필요·수동 필터를 표시한다', () => {
    render(<CommonUiExample />)
    fireEvent.click(screen.getByRole('button', { name: '확인 필요 1' }))
    expect(screen.getByRole('status')).toHaveTextContent('1–1 / 1명')
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: '없는 이름' },
    })
    expect(
      screen.getByRole('cell', { name: '검색 결과가 없어요' }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '회원 검색 지우기' }))
    fireEvent.click(screen.getByRole('button', { name: '수동' }))
    expect(
      within(screen.getByRole('table')).getByText('정지훈'),
    ).toBeInTheDocument()
  })

  it('회원을 선택해 패널을 열고 취소한 입력은 원래 데이터에 남기지 않는다', () => {
    render(<CommonUiExample />)
    const table = within(screen.getByRole('table', { name: '회원 목록' }))
    fireEvent.click(table.getByRole('button', { name: '권제이' }))
    const panel = within(
      screen.getByRole('complementary', { name: '직접 지정' }),
    )
    const studentNo = panel.getByLabelText(/학번 · 선택/)
    expect(studentNo).toHaveValue('20303')
    fireEvent.change(studentNo, { target: { value: '20399' } })
    fireEvent.click(panel.getByRole('button', { name: '취소' }))
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    fireEvent.click(table.getByRole('button', { name: '권제이' }))
    expect(screen.getByLabelText(/학번 · 선택/)).toHaveValue('20303')
  })
})
