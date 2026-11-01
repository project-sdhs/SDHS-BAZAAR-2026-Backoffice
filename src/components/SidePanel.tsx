import { useEffect, useId, useRef, type ReactNode } from 'react'
import styles from './SidePanel.module.css'

interface SidePanelProps {
  open: boolean
  title: string
  badge?: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
}

export default function SidePanel({
  open,
  title,
  badge,
  children,
  onClose,
  footer,
}: SidePanelProps) {
  const titleId = useId()
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    titleRef.current?.focus()
    return () => previousFocus?.focus()
  }, [open])

  if (!open) return null

  return (
    <aside
      className={styles.panel}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
          event.preventDefault()
          onClose()
        }
      }}
    >
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2
            id={titleId}
            ref={titleRef}
            tabIndex={-1}
            className={styles.title}
          >
            {title}
          </h2>
          {badge && <span className={styles.badge}>{badge}</span>}
        </div>
        <button
          type="button"
          className={styles.close}
          aria-label={`${title} 닫기`}
          onClick={onClose}
        >
          <span className={styles.icon} aria-hidden="true" />
        </button>
      </header>
      <div className={styles.content}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </aside>
  )
}
