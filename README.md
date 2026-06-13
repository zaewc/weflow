# WEFLOW Web

[![CI](https://github.com/zaewc/weflow/actions/workflows/ci.yml/badge.svg)](https://github.com/zaewc/weflow/actions/workflows/ci.yml)

문의 전환을 목표로 하는 WEFLOW 공식 웹사이트입니다. 서비스·가격·성공사례를 소개하고, 무료진단과 상담 예약 접수부터 관리자 처리 및 엑셀 내보내기까지 제공합니다.

## 기술 스택

- Next.js 14 App Router, React 18, TypeScript strict
- Tailwind CSS, shadcn/ui 구조, Motion, Lucide React
- Upstash Redis 또는 로컬 JSON 파일 저장소
- Vitest, React Testing Library, Playwright, Lighthouse CI
- Vercel, GitHub Actions

## 시작하기

Node.js 20 이상을 권장합니다.

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 환경변수

루트에 `.env.local`을 생성합니다.

```dotenv
ADMIN_KEY=change-this-admin-key

# Vercel KV 호환 이름
KV_REST_API_URL=
KV_REST_API_TOKEN=

# 또는 Upstash 기본 이름
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

| 변수 | 설명 |
| --- | --- |
| `ADMIN_KEY` | 관리자 API 및 `/admin` 로그인 키 |
| `KV_REST_API_URL` | Redis REST URL |
| `KV_REST_API_TOKEN` | Redis REST 토큰 |
| `UPSTASH_REDIS_REST_URL` | `KV_REST_API_URL`의 대체 이름 |
| `UPSTASH_REDIS_REST_TOKEN` | `KV_REST_API_TOKEN`의 대체 이름 |

`ADMIN_KEY`가 없으면 개발 기본값 `weflow2026`을 사용합니다. 배포 환경에서는 반드시 별도 값을 설정해야 합니다.

Redis URL과 토큰이 모두 없으면 접수 데이터는 `data/submissions.json`에 저장됩니다. 이 방식은 로컬 개발용이며 서버리스 배포의 영속 저장소로 사용할 수 없습니다.

## 주요 기능

- 반응형 홈과 서비스·가격·성공사례 소개
- Motion 기반 CTA, 글래스 UI, 하단 퀵 메뉴 Dock
- 무료진단 문의 및 날짜·시간 기반 상담 예약
- 요청 데이터 검증과 파일/Redis 저장소 자동 전환
- 관리자 키 인증, 5초 주기 자동 갱신
- 접수 상태 변경, 삭제, 상태 필터
- 예약·문의별 또는 전체 Excel 다운로드
- 관리자 페이지에서 공용 헤더·푸터·Dock 자동 제외

## 페이지

| 경로 | 설명 |
| --- | --- |
| `/` | 홈: Hero, 케어 플랜, 성공사례, 제작 과정, 후기 |
| `/services` | 제작 프로세스와 광고·SEO 운영 안내 |
| `/pricing` | 제작·케어·광고 플랜 |
| `/cases` | 이미지 기반 성공사례 목록 |
| `/cases/[slug]` | 성공사례 상세 |
| `/reservation` | 날짜와 시간대 상담 예약 |
| `/diagnosis` | 무료진단 문의 접수 |
| `/landing` | 전환형 랜딩 페이지와 고정 문의 폼 |
| `/showcase` | 글래스 Dock과 버튼 UI 컴포넌트 쇼케이스 |
| `/privacy` | 개인정보처리방침 |
| `/terms` | 이용약관 |
| `/admin` | 예약·문의 관리자 대시보드 |

## API

관리자 요청은 `x-admin-key` 헤더가 필요합니다.

| Method | 경로 | 설명 | 인증 |
| --- | --- | --- | --- |
| `POST` | `/api/submissions` | 예약 또는 문의 접수 | 없음 |
| `GET` | `/api/submissions` | 전체 접수 목록 | 관리자 |
| `PATCH` | `/api/submissions/[id]` | 상태 변경 | 관리자 |
| `DELETE` | `/api/submissions/[id]` | 접수 삭제 | 관리자 |
| `GET` | `/api/export?kind=all` | Excel 다운로드 | 관리자 |

`kind`에는 `all`, `reservation`, `inquiry`를 사용할 수 있습니다. 상태값은 `pending`, `in_progress`, `done`입니다.

## 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버
npm run lint       # ESLint
npm run typecheck  # TypeScript 검사
npm test           # Vitest 단위·통합 테스트
npm run test:watch # Vitest 감시 모드
npm run test:cov   # 100% 임계값 커버리지 검사
npm run e2e        # Playwright E2E
npm run lhci       # Lighthouse CI
```

Playwright를 처음 실행할 때 Chromium 설치가 필요합니다.

```bash
npx playwright install chromium
```

## 테스트와 품질 기준

- `tests/lib`: 검증, 인증, 데이터, 저장소
- `tests/api`: 접수·상태 변경·삭제·Excel API
- `tests/components`: 공용 UI, 폼, 관리자 컴포넌트
- `tests/pages`: 페이지 렌더링
- `tests/e2e`: 내비게이션, 접수, 예약, 관리자 흐름
- `tests/spec`: 페이지 및 매뉴얼 데이터 요구사항

Vitest 커버리지 기준은 statements, branches, functions, lines 모두 100%입니다. `src/components/ui`의 벤더 UI 컴포넌트는 커버리지 대상에서 제외됩니다.

Lighthouse는 `/`, `/pricing`, `/landing`, `/diagnosis`를 데스크톱 프리셋으로 3회 측정하고 중앙값을 사용합니다.

| 항목 | 최소 점수 |
| --- | --- |
| Performance | 70 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## 프로젝트 구조

```text
src/
├── app/                 # 페이지와 Route Handler
├── components/
│   ├── admin/           # 관리자 UI
│   ├── home/            # 홈 전용 섹션
│   └── ui/              # shadcn 및 커스텀 UI 컴포넌트
└── lib/                 # 인증, 저장소, 검증, 정적 데이터
tests/
├── api/
├── components/
├── e2e/
├── lib/
├── pages/
└── spec/
public/                  # 로고와 성공사례 이미지
data/                    # 로컬 접수 데이터
```

## CI/CD

`main` push와 PR에서 GitHub Actions CI가 다음 작업을 병렬 실행합니다.

- `quality`: lint, typecheck, production build
- `test`: Vitest 100% 커버리지 및 리포트 업로드
- `e2e`: Chromium Playwright 및 실패 리포트 업로드
- `lighthouse`: 프로덕션 빌드 기반 Lighthouse 검사

CI 성공 후 `deploy.yml`이 Vercel 프로덕션 배포를 실행합니다. 자동 배포에는 다음 GitHub Actions Secret이 필요합니다.

| Secret | 설명 |
| --- | --- |
| `VERCEL_TOKEN` | Vercel 계정 토큰 |
| `VERCEL_ORG_ID` | Vercel 조직 ID |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID |

`VERCEL_TOKEN`이 없으면 배포 단계는 실패 처리 없이 건너뜁니다.

## 연락처

사이트 정보와 외부 채널 주소는 `src/lib/site.ts`에서 관리합니다.

- 전화: `010-2971-7280`
- 이메일: `contact@weflowlab.kr`
- 카카오톡, 네이버 블로그, Instagram, Facebook 연결
