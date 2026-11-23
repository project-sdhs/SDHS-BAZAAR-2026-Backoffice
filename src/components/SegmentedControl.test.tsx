import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SegmentedControl from './SegmentedControl'

const options = [
  { value: 'all', label: '전체' },
  { value: '1', label: '1학년' },
  { value: '2', label: '2학년', disabled: true },
]

describe('SegmentedControl', () => {
  it('선택값을 표시하고 선택한 값을 부모에 전달한다', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <SegmentedControl
        label="학년"
        options={options}
        value="all"
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('group', { name: '학년' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '전체' })).toBeChecked()

    fireEvent.click(screen.getByRole('radio', { name: '1학년' }))
    expect(onChange).toHaveBeenCalledWith('1')
    rerender(
      <SegmentedControl
        label="학년"
        options={options}
        value="1"
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('radio', { name: '1학년' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '전체' })).not.toBeChecked()
  })

  it('항목별 비활성화와 그룹 전체 비활성화를 지원한다', () => {
    const { rerender } = render(
      <SegmentedControl
        label="학년"
        options={options}
        value="all"
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('radio', { name: '2학년' })).toBeDisabled()
    rerender(
      <SegmentedControl
        label="학년"
        options={options}
        value="all"
        onChange={vi.fn()}
        disabled
      />,
    )
    screen
      .getAllByRole('radio')
      .forEach((radio) => expect(radio).toBeDisabled())
  })

  it('여러 그룹을 렌더링해도 각 그룹의 선택이 독립적이다', () => {
    render(
      <>
        <SegmentedControl
          label="첫 번째 학년"
          options={options}
          value="all"
          onChange={vi.fn()}
        />
        <SegmentedControl
          label="두 번째 학년"
          options={options}
          value="1"
          onChange={vi.fn()}
        />
      </>,
    )
    const radios = screen.getAllByRole('radio', { name: '전체' })
    expect(radios[0].getAttribute('name')).not.toBe(
      radios[1].getAttribute('name'),
    )
  })
})
