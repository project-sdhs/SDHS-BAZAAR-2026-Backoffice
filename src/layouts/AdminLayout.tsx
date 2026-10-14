import { NavLink, Outlet } from 'react-router'
import { PATHS } from '../router/paths'
import styles from './AdminLayout.module.css'

/** 사이드바 메뉴. 새 관리자 화면을 만들면 여기에 한 줄 추가해요. */
const NAV_ITEMS = [{ to: PATHS.dashboard, label: '대시보드' }]

/** 관리자 화면 공통 틀: 위쪽 헤더 + 왼쪽 사이드바 + 가운데 내용(<Outlet />) */
export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.brand}>디지텍 바자회</span>
        <span className={styles.badge}>백오피스</span>
      </header>

      <nav className={styles.sidebar} aria-label="관리자 메뉴">
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={styles.navLink}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
