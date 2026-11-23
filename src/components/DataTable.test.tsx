import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DataTable, { type DataTableColumn } from './DataTable'

interface Member {
  id: number
  name: string
  studentNo: string
}

const columns: DataTableColumn<Member>[] = [
  {
    key: 'name',
    header: '이름',
    render: (member) => <strong>{member.name}</strong>,
  },
  { key: 'studentNo', header: '학번', render: (member) => member.studentNo },
]

describe('DataTable', () => {
  it('전달한 열과 데이터를 표로 보여주고 셀의 JSX를 지원한다', () => {
    render(
      <DataTable
        label="회원 목록"
        columns={columns}
        rows={[{ id: 1, name: '이재원', studentNo: '2205' }]}
        getRowKey={(member) => member.id}
      />,
    )

    expect(screen.getByRole('table', { name: '회원 목록' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '학번' })).toHaveAttribute(
      'scope',
      'col',
    )
    expect(screen.getByRole('cell', { name: '2205' })).toBeInTheDocument()
    expect(screen.getByText('이재원').tagName).toBe('STRONG')
  })

  it('데이터가 없으면 전체 열 너비에 빈 상태를 표시한다', () => {
    render(
      <DataTable<Member>
        label="회원 목록"
        columns={columns}
        rows={[]}
        getRowKey={(member) => member.id}
        emptyMessage="검색 결과가 없어요"
      />,
    )

    expect(
      screen.getByRole('cell', { name: '검색 결과가 없어요' }),
    ).toHaveAttribute('colspan', '2')
  })
})
