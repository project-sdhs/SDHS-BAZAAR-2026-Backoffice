import { Link } from 'react-router'
import { PATHS } from '../router/paths'
import styles from './NotFoundPage.module.css'

/** 없는 주소로 들어왔을 때 보여주는 화면 (404) */
export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <h1>페이지를 찾을 수 없어요</h1>
      <p className={styles.description}>주소가 바뀌었거나 없는 페이지예요.</p>
      <Link to={PATHS.login}>처음으로</Link>
    </main>
  )
}
