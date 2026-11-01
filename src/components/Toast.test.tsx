import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Toast from './Toast'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('Toast', () => {
  it('성공과 오류를 각각 적절한 알림 역할로 표시한다', () => {
    const { rerender } = render(
      <Toast message="저장했어요" onClose={vi.fn()} />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('저장했어요')
    rerender(
      <Toast
        message="입력 내용을 확인해 주세요"
        type="error"
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      '입력 내용을 확인해 주세요',
    )
  })

  it('정해진 시간이 지나면 닫기를 요청한다', () => {
    const onClose = vi.fn()
    render(<Toast message="저장했어요" duration={1000} onClose={onClose} />)
    act(() => vi.advanceTimersByTime(999))
    expect(onClose).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('마우스를 올리거나 키보드 포커스가 있으면 자동 닫기를 멈춘다', () => {
    const onClose = vi.fn()
    render(<Toast message="저장했어요" duration={1000} onClose={onClose} />)
    const toast = screen.getByRole('status')
    const button = screen.getByRole('button', { name: '알림 닫기' })
    fireEvent.mouseEnter(toast)
    act(() => vi.advanceTimersByTime(2000))
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.focus(button)
    fireEvent.mouseLeave(toast)
    act(() => vi.advanceTimersByTime(2000))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.blur(button)
    act(() => vi.advanceTimersByTime(1000))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('duration이 0이면 유지하며 닫기 버튼으로 종료를 요청한다', () => {
    const onClose = vi.fn()
    render(
      <Toast message="내용을 확인해 주세요" duration={0} onClose={onClose} />,
    )
    act(() => vi.advanceTimersByTime(10000))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: '알림 닫기' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('사라진 알림의 타이머는 정리하고 빈 메시지는 표시하지 않는다', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <Toast message="저장했어요" duration={1000} onClose={onClose} />,
    )
    rerender(<Toast message="" onClose={onClose} />)
    act(() => vi.advanceTimersByTime(2000))
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
