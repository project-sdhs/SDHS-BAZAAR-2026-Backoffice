import type { Key, ReactNode } from 'react'
import styles from './DataTable.module.css'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right'
}

interface DataTableProps<T> {
  label: string
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => Key
  selectedRowKey?: Key
  emptyMessage?: string
}

export default function DataTable<T>({
  label,
  columns,
  rows,
  getRowKey,
  selectedRowKey,
  emptyMessage = '표시할 데이터가 없어요',
}: DataTableProps<T>) {
  return (
    <div
      className={styles.wrapper}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table className={styles.table}>
        <caption className={styles.caption}>{label}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={styles[column.align ?? 'left']}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={
                getRowKey(row) === selectedRowKey ? styles.selected : undefined
              }
            >
              {columns.map((column) => (
                <td key={column.key} className={styles[column.align ?? 'left']}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
