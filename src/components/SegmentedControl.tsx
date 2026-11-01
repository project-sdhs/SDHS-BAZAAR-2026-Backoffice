import { useId } from 'react'
import styles from './SegmentedControl.module.css'

interface SegmentOption {
  value: string
  label: string
  disabled?: boolean
}

interface SegmentedControlProps {
  label: string
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function SegmentedControl({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: SegmentedControlProps) {
  const name = useId()

  return (
    <fieldset className={styles.group} disabled={disabled}>
      <legend className={styles.legend}>{label}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.item}>
          <input
            className={styles.input}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
          />
          <span className={styles.option}>{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
