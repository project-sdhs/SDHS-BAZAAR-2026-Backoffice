import type { ReactNode } from 'react'
import styles from './FilterChip.module.css'

interface FilterChipProps {
  children: ReactNode
  selected: boolean
  onChange: (selected: boolean) => void
  disabled?: boolean
}

export default function FilterChip({
  children,
  selected,
  onChange,
  disabled = false,
}: FilterChipProps) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onChange(!selected)}
    >
      {children}
    </button>
  )
}
