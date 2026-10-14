import { Link } from 'react-router'
import { PATHS } from '../router/paths'
import styles from './LoginPage.module.css'

/** 로그인 화면 (아직 준비 중) */
export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.description}>준비 중</p>
        {/* 로그인 기능이 생기기 전까지 대시보드로 가는 임시 링크 */}
        <Link to={PATHS.dashboard} className={styles.tempLink}>
          대시보드로 (임시)
        </Link>
      </section>
    </main>
  )
}
