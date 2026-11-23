import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SidePanel from './SidePanel'

describe('SidePanel', () => {
  it('열린 상태에서 제목, 본문, 하단 버튼을 보여준다', () => {
    const { rerender } = render(
      <SidePanel
        open
        title="직접 지정"
        onClose={vi.fn()}
        footer={<button>저장</button>}
      >
        <p>회원 정보</p>
      </SidePanel>,
    )
    expect(
      screen.getByRole('complementary', { name: '직접 지정' }),
    ).toBeInTheDocument()
    expect(screen.getByText('회원 정보')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument()

    rerender(
      <SidePanel open={false} title="직접 지정" onClose={vi.fn()}>
        회원 정보
      </SidePanel>,
    )
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  it('닫기 버튼과 패널 안의 Escape 키로 닫기를 요청한다', () => {
    const onClose = vi.fn()
    render(
      <SidePanel open title="직접 지정" onClose={onClose}>
        회원 정보
      </SidePanel>,
    )
    fireEvent.click(screen.getByRole('button', { name: '직접 지정 닫기' }))
    expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(screen.getByRole('heading', { name: '직접 지정' }), {
      key: 'Escape',
    })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('열면 제목으로 포커스를 옮기고 닫으면 원래 버튼으로 돌아간다', () => {
    const { rerender } = render(
      <>
        <button>패널 열기</button>
        <SidePanel open={false} title="직접 지정" onClose={vi.fn()}>
          회원 정보
        </SidePanel>
      </>,
    )
    const trigger = screen.getByRole('button', { name: '패널 열기' })
    trigger.focus()
    rerender(
      <>
        <button>패널 열기</button>
        <SidePanel open title="직접 지정" onClose={vi.fn()}>
          회원 정보
        </SidePanel>
      </>,
    )
    expect(screen.getByRole('heading', { name: '직접 지정' })).toHaveFocus()
    rerender(
      <>
        <button>패널 열기</button>
        <SidePanel open={false} title="직접 지정" onClose={vi.fn()}>
          회원 정보
        </SidePanel>
      </>,
    )
    expect(trigger).toHaveFocus()
  })
})
