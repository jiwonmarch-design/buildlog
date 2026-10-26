# Phase 2 결과: 사용자 모델과 SQLite3 기반

## 완료한 내용

- 개발 실행 DB를 로컬 `database/buildlog.sqlite3`로 구성했습니다.
- 자동 테스트는 테스트마다 분리된 SQLite3 DB를 사용합니다.
- SQLAlchemy 연결과 요청별 세션 관리를 구현했습니다.
- 사용자와 로그인 세션 모델을 만들었습니다.
- 이메일과 닉네임 중복 방지 조건을 추가했습니다.
- 비밀번호는 Argon2 해시로만 저장합니다.
- Alembic 초기 변경 기록을 만들었습니다.
- 마이그레이션 적용, 되돌리기와 재적용을 확인했습니다.
- Supabase 연결은 진행하지 않았습니다.

## 확인 결과

- 생성 테이블: `users`, `auth_sessions`, `alembic_version`
- Alembic upgrade: 통과
- Alembic downgrade: 통과
- Alembic 재적용: 통과
- 백엔드 전체 테스트: 통과

## 다음 할 일

Phase 3의 회원가입, 로그인, 로그아웃, 현재 사용자 확인과 닉네임 변경을 React 화면과 연결합니다.
