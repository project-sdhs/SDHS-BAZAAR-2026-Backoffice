import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FilterChip from './FilterChip'

describe('FilterChip', () => {
  it('선택과 해제를 요청하고 부모의 선택값을 반영한다', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <FilterChip selected={false} onChange={onChange}>
        반장
      </FilterChip>,
    )
    const button = screen.getByRole('button', { name: '반장' })

    fireEvent.click(button)
    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(button).toHaveAttribute('aria-pressed', 'false')

    rerender(
      <FilterChip selected onChange={onChange}>
        반장
      </FilterChip>,
    )
    expect(button).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(button)
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('비활성화 상태에서는 선택을 바꾸지 않는다', () => {
    const onChange = vi.fn()
    render(
      <FilterChip selected={false} disabled onChange={onChange}>
        반장
      </FilterChip>,
    )
    fireEvent.click(screen.getByRole('button', { name: '반장' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
