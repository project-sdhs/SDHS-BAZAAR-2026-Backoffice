import { useCallback, useState } from 'react'
import DataTable, { type DataTableColumn } from '../components/DataTable'
import FilterChip from '../components/FilterChip'
import Pagination from '../components/Pagination'
import SearchInput from '../components/SearchInput'
import SegmentedControl from '../components/SegmentedControl'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import MemberPanel, { type MemberForm } from './MemberPanel'
import styles from './CommonUiExample.module.css'

interface Member {
  id: number
  name: string
  studentNo: string
  grade: string
  className: string
  role: string
}

const members: Member[] = [
  {
    id: 1,
    name: '정태훈',
    studentNo: '20317',
    grade: '2',
    className: '2학년 3반',
    role: '반장',
  },
  {
    id: 2,
    name: '권제이',
    studentNo: '20303',
    grade: '2',
    className: '2학년 3반',
    role: '캐셔',
  },
  {
    id: 3,
    name: '박시후',
    studentNo: '20307',
    grade: '2',
    className: '2학년 3반',
    role: '캐셔',
  },
  {
    id: 4,
    name: '최원혁',
    studentNo: '20320',
    grade: '2',
    className: '2학년 3반',
    role: '학생',
  },
  {
    id: 5,
    name: '정지훈',
    studentNo: '20113',
    grade: '2',
    className: '2학년 1반',
    role: '학생',
  },
  {
    id: 6,
    name: '카피바라',
    studentNo: '20102',
    grade: '2',
    className: '2학년 1반',
    role: '반장',
  },
  {
    id: 7,
    name: '김현',
    studentNo: '10103',
    grade: '1',
    className: '1학년 1반',
    role: '반장',
  },
  {
    id: 8,
    name: '오세린',
    studentNo: '10201',
    grade: '1',
    className: '1학년 2반',
    role: '학생',
  },
  {
    id: 9,
    name: '한지우',
    studentNo: '30103',
    grade: '3',
    className: '3학년 1반',
    role: '반장',
  },
  {
    id: 10,
    name: '정하늘',
    studentNo: '30205',
    grade: '3',
    className: '3학년 2반',
    role: '학생',
  },
]

const gradeOptions = [
  { value: 'all', label: '전체' },
  { value: '1', label: '1학년' },
  { value: '2', label: '2학년' },
  { value: '3', label: '3학년' },
  { value: 'teacher', label: '교직원' },
]

const pageSize = 10
// 출처와 확인 필요 표시는 화면 확인용 임시 상태입니다.
const manualIds = [5]
const reviewIds = [10]

export default function CommonUiExample() {
  const [grade, setGrade] = useState('all')
  const [classNo, setClassNo] = useState('all')
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number | null>(members[0].id)
  const [changes, setChanges] = useState<Record<number, MemberForm>>({})
  const [pending, setPending] = useState<MemberForm | null>(null)
  const [notice, setNotice] = useState<{ id: number; message: string } | null>(
    null,
  )
  const closeNotice = useCallback(() => setNotice(null), [])

  const displayMembers = members.map((member) => {
    const change = changes[member.id]
    if (!change) return member
    const teacher = change.type === 'teacher'
    return {
      ...member,
      role: teacher
        ? '선생님'
        : member.role === '선생님'
          ? '학생'
          : member.role,
      grade: teacher ? '' : change.grade,
      className: teacher ? '—' : `${change.grade}학년 ${change.classNo}반`,
      studentNo: teacher ? '' : change.studentNo,
    }
  })

  function isManual(member: Member) {
    return manualIds.includes(member.id) || Boolean(changes[member.id])
  }

  function needsReview(member: Member) {
    return reviewIds.includes(member.id) && !changes[member.id]
  }

  const reviewCount = displayMembers.filter(needsReview).length
  const teacherCount = displayMembers.filter(
    (member) => member.role === '선생님',
  ).length
  const filteredMembers = displayMembers.filter((member) => {
    const matchesGrade =
      grade === 'all' ||
      (grade === 'teacher' ? member.role === '선생님' : member.grade === grade)
    const matchesClass =
      classNo === 'all' || member.className.endsWith(`${classNo}반`)
    const matchesSearch = `${member.name} ${member.studentNo}`.includes(
      search.trim(),
    )
    let matchesFilter = true
    if (filter === 'review') matchesFilter = needsReview(member)
    else if (filter === 'manual') matchesFilter = isManual(member)
    else if (filter) matchesFilter = member.role === filter
    return matchesGrade && matchesClass && matchesSearch && matchesFilter
  })
  const start = (page - 1) * pageSize
  const visibleMembers = filteredMembers.slice(start, start + pageSize)
  const totalPages = Math.ceil(filteredMembers.length / pageSize)
  const selectedMember = displayMembers.find(
    (member) => member.id === selectedId,
  )
  const leaderClass = selectedMember?.grade
    ? selectedMember.className
    : '2학년 3반'
  const leader = displayMembers.find(
    (member) => member.className === leaderClass && member.role === '반장',
  )

  function openMember(member: Member) {
    setSelectedId(member.id)
  }

  function confirmChange() {
    if (!selectedMember || !pending) return
    setChanges((previous) => ({ ...previous, [selectedMember.id]: pending }))
    setPending(null)
    setNotice((previous) => ({
      id: (previous?.id ?? 0) + 1,
      message: '이 화면의 임시 표시를 변경했어요',
    }))
  }

  const columns: DataTableColumn<Member>[] = [
    {
      key: 'name',
      header: '이름',
      render: (member) => (
        <button
          type="button"
          className={styles.name}
          onClick={() => openMember(member)}
        >
          <span className={styles.avatar} aria-hidden="true">
            {member.name[0]}
          </span>
          <strong>{member.name}</strong>
        </button>
      ),
    },
    {
      key: 'studentNo',
      header: '학번',
      render: (member) => (
        <span className={styles.muted}>{member.studentNo || '—'}</span>
      ),
    },
    {
      key: 'account',
      header: '가입 계정',
      render: () => <span className={styles.muted}>학교 계정</span>,
    },
    { key: 'className', header: '반', render: (member) => member.className },
    {
      key: 'role',
      header: '역할',
      render: (member) => (
        <span className={member.role === '반장' ? styles.leader : styles.badge}>
          {member.role}
        </span>
      ),
    },
    {
      key: 'source',
      header: '맞춘 곳',
      render: (member) =>
        needsReview(member) ? (
          <span className={styles.error}>
            <span
              className={`${styles.icon} ${styles.errorIcon}`}
              aria-hidden="true"
            />
            그룹 없음 · 지정 필요
          </span>
        ) : isManual(member) ? (
          <span>
            <span className={styles.manual}>수동</span> 관리자 직접 지정
          </span>
        ) : (
          <span className={styles.source}>
            <span
              className={`${styles.icon} ${styles.groups}`}
              aria-hidden="true"
            />
            Google 그룹
          </span>
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (member) => (
        <details className={styles.menu} name="member-actions">
          <summary aria-label={`${member.name} 더보기`}>
            <span
              className={`${styles.icon} ${styles.more}`}
              aria-hidden="true"
            />
          </summary>
          <div className={styles.menuItems}>
            <button
              type="button"
              onClick={(event) => {
                openMember(member)
                event.currentTarget.closest('details')?.removeAttribute('open')
              }}
            >
              직접 지정(예외)…<small>학년 · 반 또는 선생님 · 관리자만</small>
            </button>
            <button
              type="button"
              disabled
              title="반장 지정 기능은 아직 연결하지 않았어요"
            >
              반장으로 지정<small>반이 정해진 학생만</small>
            </button>
            <button
              type="button"
              disabled
              title="크레딧 조정 기능은 아직 연결하지 않았어요"
            >
              크레딧 조정…<small>지급 · 차감 · 관리자만</small>
            </button>
          </div>
        </details>
      ),
    },
  ]

  const filters = [
    { value: 'review', label: `확인 필요 ${reviewCount}` },
    { value: '반장', label: '반장' },
    { value: '캐셔', label: '캐셔' },
    { value: '방문객', label: '방문객' },
    { value: 'manual', label: '수동' },
  ]

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>반 · 회원 관리</h1>
          <p>
            학생 · 선생님은 학교 Google 그룹 동기화로 맞추고, 반장 · 캐셔만 직접
            정해요
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.button}
            type="button"
            disabled
            title="실제 회원 내보내기는 아직 연결하지 않았어요"
          >
            <span
              className={`${styles.icon} ${styles.download}`}
              aria-hidden="true"
            />
            내보내기
          </button>
          <button
            className={styles.primary}
            type="button"
            disabled
            title="Google 그룹 동기화는 아직 연결하지 않았어요"
          >
            <span
              className={`${styles.icon} ${styles.sync}`}
              aria-hidden="true"
            />
            Google 그룹 동기화
          </button>
        </div>
      </header>

      <section className={styles.syncBox} aria-label="동기화 현황">
        <span className={`${styles.icon} ${styles.check}`} aria-hidden="true" />
        <div>
          <strong>마지막 동기화 정보 없음</strong>
          <p>
            임시 회원 {members.length}명 · 선생님 {teacherCount}명 · 확인 필요{' '}
            {reviewCount}건 · 반 그룹 연결은 설정에서
          </p>
        </div>
        <button
          className={styles.linkButton}
          type="button"
          disabled
          title="그룹 연결 화면은 아직 연결하지 않았어요"
        >
          그룹 연결 보기
          <span
            className={`${styles.icon} ${styles.chevron}`}
            aria-hidden="true"
          />
        </button>
      </section>

      <section className={styles.stats} aria-label="회원 요약">
        <div className={styles.stat}>
          <span>학생</span>
          <p>
            <strong>{members.length - teacherCount}</strong> 반 그룹 기준
          </p>
        </div>
        <div className={styles.stat}>
          <span>앱 가입</span>
          <p>
            <strong>{members.length}</strong> 100%
          </p>
        </div>
        <div className={styles.stat}>
          <span>선생님</span>
          <p>
            <strong>{teacherCount}</strong> 선생님 그룹
          </p>
        </div>
        <div className={styles.stat}>
          <span>확인 필요</span>
          <p>
            <strong className={styles.error}>{reviewCount}</strong> 그룹 없음{' '}
            {reviewCount}
          </p>
        </div>
      </section>

      <section aria-label="회원 목록 예제">
        <div className={styles.filters}>
          <SegmentedControl
            label="학년 선택"
            options={gradeOptions}
            value={grade}
            onChange={(value) => {
              setGrade(value)
              setPage(1)
            }}
          />
          <select
            className={styles.select}
            aria-label="반 선택"
            value={classNo}
            onChange={(event) => {
              setClassNo(event.target.value)
              setPage(1)
            }}
          >
            <option value="all">반 전체</option>
            {['1', '2', '3', '4'].map((value) => (
              <option key={value} value={value}>
                {value}반
              </option>
            ))}
          </select>
          <div className={styles.chips}>
            {filters.map((item) => (
              <FilterChip
                key={item.value}
                selected={filter === item.value}
                onChange={(selected) => {
                  setFilter(selected ? item.value : '')
                  setPage(1)
                }}
              >
                {item.label}
              </FilterChip>
            ))}
          </div>
          <div className={styles.search}>
            <SearchInput
              label="회원 검색"
              placeholder="이름 · 학번"
              value={search}
              onChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
            />
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.list}>
            <DataTable
              label="회원 목록"
              columns={columns}
              rows={visibleMembers}
              getRowKey={(member) => member.id}
              selectedRowKey={selectedId ?? undefined}
              emptyMessage="검색 결과가 없어요"
            />
            <footer className={styles.footer}>
              <p role="status">
                {grade === 'all'
                  ? '전체'
                  : grade === 'teacher'
                    ? '교직원'
                    : `${grade}학년`}{' '}
                ·{' '}
                {filteredMembers.length === 0
                  ? '0명'
                  : `${start + 1}–${start + visibleMembers.length} / ${filteredMembers.length}명`}
              </p>
              <p>
                <span className={styles.manual}>수동</span> 관리자가 직접 지정한
                사람 — 다음 동기화에서 바뀌지 않아요
              </p>
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              )}
            </footer>
          </div>
          <div className={styles.side}>
            {selectedMember && (
              <MemberPanel
                key={selectedMember.id}
                name={selectedMember.name}
                studentNo={selectedMember.studentNo}
                grade={selectedMember.grade}
                className={selectedMember.className}
                teacher={selectedMember.role === '선생님'}
                onClose={() => setSelectedId(null)}
                onSubmit={setPending}
              />
            )}
            <section className={styles.leaderCard} aria-label="반장 정보">
              <h2>
                {leaderClass} 반장 <span>반마다 1명</span>
              </h2>
              {leader ? (
                <div className={styles.leaderRow}>
                  <span className={styles.avatar} aria-hidden="true">
                    {leader.name[0]}
                  </span>
                  <strong>{leader.name}</strong>
                  <span className={styles.muted}>{leader.studentNo}</span>
                  <span className={styles.leader}>반장</span>
                  <button
                    className={styles.linkButton}
                    type="button"
                    disabled
                    title="실제 반장 변경은 아직 연결하지 않았어요"
                  >
                    반장 바꾸기
                  </button>
                </div>
              ) : (
                <p className={styles.muted}>반장을 지정하지 않았어요.</p>
              )}
              <p>
                관리자 · 담당 선생님이 정해요. 바꾸면 이전 반장은 학생으로
                돌아가고, 백오피스 반장 계정도 새 반장에게 넘어가요. 캐셔는
                반장이 앱 반 인원에서 정해요.
              </p>
            </section>
          </div>
        </div>
      </section>
      <ConfirmDialog
        open={pending !== null}
        title="직접 지정 내용을 적용할까요?"
        description="이 화면의 임시 표시만 바뀌어요. 실제 회원 정보와 권한은 변경하지 않아요."
        confirmLabel="적용하기"
        onConfirm={confirmChange}
        onCancel={() => setPending(null)}
      />
      {notice && (
        <Toast key={notice.id} message={notice.message} onClose={closeNotice} />
      )}
    </main>
  )
}
