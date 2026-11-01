import { useRef } from 'react'
import styles from './SearchInput.module.css'

interface SearchInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function SearchInput({
  label,
  value,
  onChange,
  placeholder = '검색어를 입력하세요',
  disabled = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function clearSearch() {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={styles.search}>
      <span className={styles.icon} aria-hidden="true" />
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {value !== '' && (
        <button
          type="button"
          className={styles.clear}
          aria-label={`${label} 지우기`}
          disabled={disabled}
          onClick={clearSearch}
        >
          <span className={styles.clearIcon} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
