import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SearchInput from './SearchInput'

describe('SearchInput', () => {
  it('입력값을 부모에 전달하고 외부에서 바꾼 값을 표시한다', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <SearchInput label="회원 검색" value="" onChange={onChange} />,
    )
    const input = screen.getByRole('searchbox', { name: '회원 검색' })
    fireEvent.change(input, { target: { value: '이재원' } })
    expect(onChange).toHaveBeenCalledWith('이재원')

    rerender(
      <SearchInput label="회원 검색" value="이재원" onChange={onChange} />,
    )
    expect(input).toHaveValue('이재원')
  })

  it('초기화를 요청한 뒤 검색창으로 포커스를 돌려준다', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <SearchInput label="회원 검색" value="이재원" onChange={onChange} />,
    )
    fireEvent.click(screen.getByRole('button', { name: '회원 검색 지우기' }))
    expect(onChange).toHaveBeenCalledWith('')
    expect(screen.getByRole('searchbox')).toHaveFocus()

    rerender(<SearchInput label="회원 검색" value="" onChange={onChange} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('비활성화 상태에서는 입력과 초기화를 막는다', () => {
    const onChange = vi.fn()
    render(
      <SearchInput
        label="회원 검색"
        value="이재원"
        onChange={onChange}
        disabled
      />,
    )
    expect(screen.getByRole('searchbox')).toBeDisabled()
    const clear = screen.getByRole('button', { name: '회원 검색 지우기' })
    expect(clear).toBeDisabled()
    fireEvent.click(clear)
    expect(onChange).not.toHaveBeenCalled()
  })
})
