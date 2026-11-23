import { fireEvent, render, screen } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import ConfirmDialog from './ConfirmDialog'

// jsdom에는 기본 dialog 메서드가 없어 열림/닫힘만 대신합니다.
// 실제 포커스 제한과 Escape 동작은 브라우저에서도 확인합니다.
beforeAll(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value() {
        this.setAttribute('open', '')
      },
    },
    close: {
      configurable: true,
      value() {
        this.removeAttribute('open')
      },
    },
  })
})

afterAll(() => {
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

describe('ConfirmDialog', () => {
  it('제목과 설명을 제공하고 확인·취소를 부모에게 전달한다', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="변경할까요?"
        description="변경 내용을 적용해요."
        confirmLabel="변경하기"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )

    expect(
      screen.getByRole('dialog', { name: '변경할까요?' }),
    ).toHaveAccessibleDescription('변경 내용을 적용해요.')
    expect(screen.getByRole('button', { name: '취소' })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: '취소' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('브라우저의 cancel 이벤트를 닫기 요청으로 전달한다', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="변경할까요?"
        description="변경 내용을 적용해요."
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )
    const event = new Event('cancel', { cancelable: true })
    fireEvent(screen.getByRole('dialog'), event)
    expect(event.defaultPrevented).toBe(true)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('처리 중에는 중복 확인과 취소를 막는다', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        loading
        danger
        title="반려할까요?"
        description="요청을 반려해요."
        confirmLabel="반려하기"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-busy', 'true')
    screen
      .getAllByRole('button')
      .forEach((button) => expect(button).toBeDisabled())
    fireEvent.click(screen.getByRole('button', { name: '반려하기 처리 중' }))
    fireEvent(
      screen.getByRole('dialog'),
      new Event('cancel', { cancelable: true }),
    )
    expect(onConfirm).not.toHaveBeenCalled()
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('외부에서 닫으면 스크롤과 포커스를 복구한다', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    const { rerender } = render(
      <>
        <button>확인창 열기</button>
        <ConfirmDialog
          open={false}
          title="변경할까요?"
          description="변경 내용을 적용해요."
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const trigger = screen.getByRole('button', { name: '확인창 열기' })
    trigger.focus()
    const previousOverflow = document.body.style.overflow

    rerender(
      <>
        <button>확인창 열기</button>
        <ConfirmDialog
          open
          title="변경할까요?"
          description="변경 내용을 적용해요."
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </>,
    )
    expect(document.body.style.overflow).toBe('hidden')
    rerender(
      <>
        <button>확인창 열기</button>
        <ConfirmDialog
          open={false}
          title="변경할까요?"
          description="변경 내용을 적용해요."
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe(previousOverflow)
    expect(trigger).toHaveFocus()
  })
})
