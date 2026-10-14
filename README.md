# SDHS-BAZAAR-2026-Backoffice

서울디지텍고등학교 2026 디지텍 바자회 · 백오피스 웹 (관리자 · 선생님 · 반장용).
React + TypeScript + Vite, 라우팅은 react-router v7.

## 준비물

- Node.js **22.22.2 이상의 22.x**, **24.15.0 이상의 24.x**, 또는 **26 이상** (`node -v` 로 확인)
  - 23 · 25 버전과 22.22.2 / 24.15.0 보다 낮은 버전에서는 테스트 도구(jsdom · Vitest)가 동작을 보장하지 않아요.
  - 잘 모르겠으면 [nodejs.org](https://nodejs.org/ko) 에서 **LTS** 버전을 설치하면 돼요. CI 는 Node 22 최신 버전으로 돌아요.
- npm (Node.js 와 같이 설치돼요)

## 실행

```bash
npm install                  # 처음 한 번, 그리고 package.json 이 바뀌었을 때
cp .env.example .env.local   # 서버 주소 설정 (Windows: copy .env.example .env.local)
npm run dev                  # http://localhost:5173 에서 열려요
```

`.env.local` 은 git 에 올라가지 않아요. 브라우저에 그대로 보이는 값이라 비밀 값은 넣지 않습니다.

| 환경 변수           | 뜻               | 기본값                  |
| ------------------- | ---------------- | ----------------------- |
| `VITE_API_BASE_URL` | 백엔드 서버 주소 | `http://localhost:3000` |

## 명령어

| 명령                   | 하는 일                                      |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | 개발 서버 실행 (저장하면 바로 반영)          |
| `npm test`             | 테스트 한 번 실행 (Vitest)                   |
| `npm run test:watch`   | 저장할 때마다 테스트 다시 실행               |
| `npm run lint`         | ESLint 검사                                  |
| `npm run format`       | Prettier 로 코드 모양 정리                   |
| `npm run format:check` | 정리 안 된 파일이 있는지만 확인 (CI 와 같음) |
| `npm run typecheck`    | 타입 검사만                                  |
| `npm run build`        | 타입 검사 + 배포용 빌드 (`dist/`)            |
| `npm run preview`      | 빌드 결과를 로컬에서 미리 보기               |

PR 올리기 전에: `npm run format && npm run lint && npm test && npm run build`

## 폴더 구조

```text
.github/                 # PR 템플릿 · CI 워크플로 (workflows/ci.yml)
.vscode/                 # VS Code 추천 확장 (ESLint · Prettier)
public/                  # 빌드 때 그대로 복사되는 정적 파일 (favicon.svg)
src/
├── main.tsx             # 앱 시작점: 전역 CSS + <App />
├── App.tsx              # <RouterProvider />
├── api/client.ts        # 서버 요청 fetch 래퍼 (api.get / api.post …)
├── components/          # 여러 화면이 같이 쓰는 공용 UI
├── hooks/               # 커스텀 훅 (useXxx)
├── layouts/             # 화면 틀 — AdminLayout.tsx (헤더 · 사이드바 + <Outlet />)
├── pages/               # 화면 1개 = 파일 1개 (XxxPage.tsx + XxxPage.module.css)
├── router/              # paths.ts (주소 상수) · routes.tsx (라우트 표) · index.tsx (라우터)
├── store/               # 전역 상태
├── styles/              # tokens.css (디자인 토큰) · global.css (전역 기본 스타일)
├── types/               # 공용 TypeScript 타입
└── utils/               # 작은 순수 함수
```

- 테스트는 대상 파일 옆에 `*.test.ts(x)` 로 둬요 (예: `router/routes.test.tsx`).
- 스타일은 CSS Modules(`*.module.css`)로 쓰고, 색 · 간격 · 라디우스 · 글자는 `styles/tokens.css` 의 변수만 써요 (`var(--color-primary)`). 그림자는 쓰지 않아요.

### 새 화면 추가하기

1. `src/pages/BoothsPage.tsx` 를 만든다.
2. `src/router/paths.ts` 에 주소를 추가한다 (`booths: '/booths'`).
3. `src/router/routes.tsx` 의 `AdminLayout` children 에 등록하고, 사이드바 메뉴가 필요하면 `layouts/AdminLayout.tsx` 의 `NAV_ITEMS` 에 한 줄 추가한다.

## 브랜치 · PR 규칙

- `main` 에서 새 브랜치를 만들어 작업해요: `feat/…` (기능), `fix/…` (버그), `chore/…` (설정·기타). 예) `feat/login-page`
- `main` 에 직접 push 하지 않아요. **PR → 리뷰 → Squash merge** 순서로 합칩니다.
- 커밋 메시지는 [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 형식: `feat: 로그인 화면 추가`
- PR 템플릿(무엇을 · 왜 · 확인한 것 · 스크린샷)을 채우고, CI(lint · format · build · test)가 통과한 뒤 머지해요.
