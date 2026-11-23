import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Toast.module.css'

interface ToastProps {
  message: string
  onClose: () => void
  type?: 'success' | 'error'
  duration?: number
}

export default function Toast({
  message,
  onClose,
  type = 'success',
  duration = 5000,
}: ToastProps) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!message || duration <= 0 || hovered || focused) return

    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [message, type, duration, onClose, hovered, focused])

  if (!message) return null

  return createPortal(
    <div className={styles.wrapper}>
      <div
        className={`${styles.toast} ${type === 'error' ? styles.error : ''}`}
        role={type === 'error' ? 'alert' : 'status'}
        aria-atomic="true"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span className={styles.icon} aria-hidden="true" />
        <p className={styles.message}>{message}</p>
        <button
          type="button"
          className={styles.close}
          aria-label="알림 닫기"
          onClick={onClose}
        >
          <span className={styles.closeIcon} aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body,
  )
}
