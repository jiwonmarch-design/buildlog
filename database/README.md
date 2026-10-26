# BuildLog 데이터베이스

- 현재 개발 데이터베이스: `buildlog.sqlite3`
- 자동 테스트 데이터베이스: 테스트마다 분리된 SQLite3 임시 DB
- 향후 실제 서비스 데이터베이스: Supabase PostgreSQL
- 데이터 접근: SQLAlchemy
- 데이터 구조 변경: Alembic

현재는 Supabase에 연결하지 않습니다. 관련 수업을 진행한 뒤 Phase 13에서 연결 정보를 로컬 `backend/.env`에 설정합니다. 실제 비밀값은 이 폴더나 Git 기록에 저장하지 않습니다.
