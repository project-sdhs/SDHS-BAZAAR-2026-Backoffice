import { useId, useState } from 'react'
import SegmentedControl from '../components/SegmentedControl'
import SidePanel from '../components/SidePanel'
import styles from './CommonUiExample.module.css'

export interface MemberForm {
  type: string
  grade: string
  classNo: string
  studentNo: string
}

interface MemberPanelProps {
  name: string
  studentNo: string
  grade: string
  className: string
  teacher: boolean
  onClose: () => void
  onSubmit: (value: MemberForm) => void
}

const memberTypes = [
  { value: 'student', label: '학생' },
  { value: 'teacher', label: '선생님' },
]

const grades = ['1', '2', '3'].map((value) => ({
  value,
  label: `${value}학년`,
}))
const classes = ['1', '2', '3', '4']

export default function MemberPanel(props: MemberPanelProps) {
  const formId = useId()
  const [type, setType] = useState(props.teacher ? 'teacher' : 'student')
  const [grade, setGrade] = useState(props.grade || '2')
  const [classNo, setClassNo] = useState(
    props.className.match(/(\d+)반/)?.[1] || '3',
  )
  const [studentNo, setStudentNo] = useState(props.studentNo)
  const label =
    type === 'teacher'
      ? '선생님으로 지정'
      : `${grade}학년 ${classNo}반 학생으로 지정`

  return (
    <SidePanel
      open
      title="직접 지정"
      badge="관리자만"
      onClose={props.onClose}
      footer={
        <div className={styles.panelActions}>
          <button
            type="button"
            className={styles.button}
            onClick={props.onClose}
          >
            취소
          </button>
          <button type="submit" form={formId} className={styles.primary}>
            {label}
          </button>
        </div>
      }
    >
      <form
        id={formId}
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault()
          props.onSubmit({ type, grade, classNo, studentNo })
        }}
      >
        <div className={styles.member}>
          <span className={styles.avatar} aria-hidden="true">
            {props.name[0]}
          </span>
          <div>
            <strong>{props.name}</strong>
            <p>학교 계정 · {props.className}</p>
          </div>
        </div>
        <SegmentedControl
          label="구성원 종류"
          options={memberTypes}
          value={type}
          onChange={setType}
        />
        {type === 'student' && (
          <>
            <fieldset className={styles.field}>
              <legend>학년 · 반</legend>
              <SegmentedControl
                label="지정할 학년"
                options={grades}
                value={grade}
                onChange={setGrade}
              />
              <div
                className={styles.classes}
                role="group"
                aria-label="지정할 반"
              >
                {classes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={value === classNo}
                    className={`${styles.classButton} ${value === classNo ? styles.selectedClass : ''}`}
                    onClick={() => setClassNo(value)}
                  >
                    {value}반
                  </button>
                ))}
              </div>
            </fieldset>
            <label className={styles.field}>
              학번 · 선택
              <input
                className={styles.input}
                value={studentNo}
                onChange={(event) => setStudentNo(event.target.value)}
                placeholder="예: 2219"
                inputMode="numeric"
                pattern="[0-9]{4,5}"
                maxLength={5}
              />
              <span className={styles.muted}>입금자명 규칙에 써요</span>
            </label>
          </>
        )}
        <p className={styles.help}>
          <span
            className={`${styles.icon} ${styles.info}`}
            aria-hidden="true"
          />
          그룹 결과보다 우선하고 표에 ‘수동’으로 보여요. 다음 동기화에서 그룹과
          다르면 알려 줘요.
        </p>
      </form>
    </SidePanel>
  )
}
