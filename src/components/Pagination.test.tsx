import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('페이지 번호와 이전·다음 버튼으로 이동을 요청한다', () => {
    const onChange = vi.fn()
    render(<Pagination currentPage={2} totalPages={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: '2페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    fireEvent.click(screen.getByRole('button', { name: '이전' }))
    expect(onChange).toHaveBeenLastCalledWith(1)
    fireEvent.click(screen.getByRole('button', { name: '다음' }))
    expect(onChange).toHaveBeenLastCalledWith(3)
    fireEvent.click(screen.getByRole('button', { name: '1페이지' }))
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('첫 페이지와 마지막 페이지에서 범위 밖 이동을 막는다', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={3} onChange={onChange} />,
    )
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: '이전' }))
    expect(onChange).not.toHaveBeenCalled()
    rerender(<Pagination currentPage={3} totalPages={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled()
  })

  it('페이지 수가 많아도 주변 번호와 처음·마지막만 표시한다', () => {
    const onChange = vi.fn()
    render(<Pagination currentPage={50} totalPages={100} onChange={onChange} />)
    expect(screen.getAllByRole('button')).toHaveLength(9)
    expect(screen.getByRole('button', { name: '48페이지' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '47페이지' }),
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '100페이지' }))
    expect(onChange).toHaveBeenCalledWith(100)
  })

  it('한 페이지는 양쪽 이동을 막고 데이터가 없으면 숨긴다', () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={1} onChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled()
    rerender(<Pagination currentPage={1} totalPages={0} onChange={vi.fn()} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('처리 중에는 모든 페이지 버튼을 비활성화할 수 있다', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        disabled
        onChange={vi.fn()}
      />,
    )
    screen
      .getAllByRole('button')
      .forEach((button) => expect(button).toBeDisabled())
  })
})
