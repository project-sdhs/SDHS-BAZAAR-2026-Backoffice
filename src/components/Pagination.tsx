import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
  disabled?: boolean
  label?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
  disabled = false,
  label = '페이지 이동',
}: PaginationProps) {
  if (totalPages < 1) return null

  // 현재 페이지 주변 5개만 표시해 페이지 수가 많아도 길어지지 않게 합니다.
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => startPage + index,
  )

  return (
    <nav className={styles.pagination} aria-label={label}>
      <button
        className={styles.button}
        type="button"
        disabled={disabled || currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
      >
        이전
      </button>
      {startPage > 1 && (
        <>
          <button
            className={styles.button}
            type="button"
            aria-label="1페이지"
            disabled={disabled}
            onClick={() => onChange(1)}
          >
            1
          </button>
          {startPage > 2 && (
            <span className={styles.dots} aria-hidden="true">
              …
            </span>
          )}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`${styles.button} ${page === currentPage ? styles.selected : ''}`}
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? 'page' : undefined}
          disabled={disabled}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className={styles.dots} aria-hidden="true">
              …
            </span>
          )}
          <button
            className={styles.button}
            type="button"
            aria-label={`${totalPages}페이지`}
            disabled={disabled}
            onClick={() => onChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        className={styles.button}
        type="button"
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        다음
      </button>
    </nav>
  )
}
