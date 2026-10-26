# Phase 1 결과: FastAPI·React 프로젝트 뼈대

## 1. 완료 내용

- Python 가상환경을 `backend/.venv`에 만들었습니다.
- FastAPI 프로젝트와 상태 확인 API를 만들었습니다.
- React와 TypeScript 프로젝트를 만들었습니다.
- React에서 FastAPI 상태 확인 API를 호출하게 연결했습니다.
- 개발용 React 주소만 허용하는 CORS 설정을 추가했습니다.
- 백엔드와 프런트엔드 환경 변수 예시 파일을 만들었습니다.
- 백엔드 자동 테스트, 프런트엔드 검사와 프로덕션 빌드를 준비했습니다.
- Supabase PostgreSQL과 SQLite3의 역할을 `database/README.md`에 기록했습니다.
- SQLite3 데이터 파일과 테스트 캐시 제외 규칙을 `.gitignore`에 추가했습니다.

## 2. 설치한 주요 백엔드 패키지

| 패키지 | 버전 | 용도 |
| --- | --- | --- |
| FastAPI | 0.162.0 | API 서버 |
| Uvicorn | 0.54.0 | 개발 서버 실행 |
| pydantic-settings | 2.16.1 | 환경 변수 설정 |
| SQLAlchemy | 2.1.6 | 데이터 접근 |
| Alembic | 1.20.1 | 데이터 구조 변경 관리 |
| pytest | 9.1.1 | 자동 테스트 |
| HTTPX | 0.28.1 | API 테스트 |

정확한 설치 목록은 `backend/requirements.txt`에 고정했습니다.

## 3. 프런트엔드 구성

- React 19.3.1
- TypeScript 6.0.3
- Vite 8.3.5
- Oxlint 1.88.0

정확한 의존성은 `frontend/package.json`과 `frontend/package-lock.json`에 기록되어 있습니다.

## 4. 환경 변수 예시

### 백엔드

- `APP_NAME`
- `ENVIRONMENT`
- `FRONTEND_ORIGIN`
- `DATABASE_URL`
- `TEST_DATABASE_URL`
- `SESSION_COOKIE_NAME`
- `SESSION_LIFETIME_DAYS`
- `COOKIE_SECURE`

### 프런트엔드

- `VITE_API_BASE_URL`

실제 비밀값은 생성하지 않았고 Supabase에도 연결하지 않았습니다.

## 5. 확인 결과

- 백엔드 자동 테스트: 1개 통과
- 프런트엔드 정적 검사: 통과, 경고 없음
- 프런트엔드 프로덕션 빌드: 통과
- FastAPI 실제 상태 응답: `{"status":"ok","service":"buildlog-api"}`
- React 개발 서버 HTTP 응답: 200
- 허용된 React 주소의 CORS 응답: 정상
- npm 패키지 취약점 검사: 발견 없음

## 6. 실행 방법

### 백엔드

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

### 프런트엔드

다른 터미널에서 실행합니다.

```powershell
cd frontend
npm.cmd run dev
```

PowerShell 정책 때문에 이 컴퓨터에서는 `npm` 대신 `npm.cmd`를 사용합니다.

## 7. 아직 만들지 않은 내용

Phase 1의 범위를 지키기 위해 다음 내용은 아직 만들지 않았습니다.

- SQLAlchemy 데이터베이스 연결
- Alembic 초기화와 마이그레이션
- SQLite3 테스트 데이터베이스
- Supabase 연결
- 사용자 모델
- 회원가입과 로그인
- 기록과 커뮤니티 기능

위 내용은 Phase 2부터 계획 순서대로 진행합니다.

## 8. Phase 1 완료 확인표

- [x] FastAPI 서버가 실행됩니다.
- [x] FastAPI 상태 확인 API가 동작합니다.
- [x] React 개발 서버가 실행됩니다.
- [x] React와 FastAPI가 통신할 수 있습니다.
- [x] 개발용 CORS 설정이 적용됐습니다.
- [x] 환경 변수 예시와 비밀값 분리 기준이 준비됐습니다.
- [x] 백엔드 테스트가 통과합니다.
- [x] 프런트엔드 검사와 빌드가 통과합니다.
- [x] Supabase나 사용자 기능을 미리 만들지 않았습니다.
