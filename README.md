# WEFLOW Web

문의로 이어지는 홈페이지 — 랜딩/홈페이지 제작 · 광고 운영 · 검색 상단 노출.
Next.js 14 (App Router) · TypeScript(strict) · Tailwind CSS.

## 개발

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # 타입 검사 (strict)
npm run lint         # ESLint
npm run build        # 프로덕션 빌드
```

KV 환경변수가 없으면 예약/문의 데이터는 `data/submissions.json` 파일에 저장됩니다(로컬 개발용).

## 테스트

```bash
npm test             # 단위/통합 테스트 (Vitest)
npm run test:cov     # 커버리지 (statements/branches/functions/lines 100% 임계값 강제)
npm run e2e          # E2E 테스트 (Playwright, 최초 1회 `npx playwright install chromium` 필요)
```

- **단위/통합**: `tests/lib`(데이터·검증·인증·저장소), `tests/api`(라우트 핸들러), `tests/components`·`tests/pages`(RTL). 커버리지 100% 유지.
- **E2E**: `tests/e2e` — 네비게이션, 무료진단/예약 접수, 관리자 로그인·상태변경 플로우.

## 페이지

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 (히어로 · 케어플랜 혜택 · 성공사례 · 제작 프로세스 · 후기) |
| `/services` | 6단계 제작 프로세스 · 광고/SEO 사후관리 시스템 |
| `/pricing` | 제작/케어/광고 플랜 가격 |
| `/cases`, `/cases/[slug]` | 성공사례 목록 · 상세 |
| `/reservation` | 달력 + 시간대 예약 |
| `/diagnosis` | 무료진단 신청 |
| `/landing` | 랜딩 페이지 (사이드 고정 문의창) |
| `/admin` | 관리자 대시보드 (예약/문의 관리 · 엑셀 다운로드) |

## 관리자

- 경로: `/admin`
- 키: `ADMIN_KEY` 환경변수 (미설정 시 기본값 `weflow2026`)
- 기능: 상태(대기/진행중/완료) 변경 · 삭제 · 상세 펼침 · 섹션별/전체 엑셀(.xlsx) 다운로드 · 5초 폴링 실시간 갱신

## Vercel 배포 (영속 저장소)

1. GitHub에 푸시 후 Vercel에서 Import.
2. **Storage → Marketplace → Upstash (Redis)** 통합을 추가하면 `KV_REST_API_URL`, `KV_REST_API_TOKEN`이 프로젝트에 자동 주입됩니다.
3. **Settings → Environment Variables**에 `ADMIN_KEY`를 설정.
4. 재배포하면 예약/문의가 Redis에 영속 저장됩니다.

> 저장소 분기 로직은 `src/lib/store.ts` 한 곳에 있습니다. KV 환경변수가 있으면 Redis, 없으면 파일 저장소를 사용합니다.

## 외부 링크 / 연락처

전화 `010-2971-7280` · 이메일 `contact@weflowlab.kr` · 카카오/블로그/인스타/페이스북 채널 연결 (`src/lib/site.ts`).
