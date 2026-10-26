# BuildLog 백엔드

FastAPI로 만든 BuildLog API 프로젝트입니다.

## 가상환경과 패키지

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 실행

```powershell
.\.venv\Scripts\python.exe -m alembic upgrade head
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

- API 기본 주소: `http://localhost:8000`
- 상태 확인: `http://localhost:8000/api/health`
- API 문서: `http://localhost:8000/docs`

## 테스트

```powershell
.\.venv\Scripts\python.exe -m pytest
```

실제 환경 변수는 `.env.example`을 참고해 `.env`에 저장합니다.

현재 개발 데이터는 `../database/buildlog.sqlite3`에 저장됩니다. 이 파일은 Git에서 제외됩니다.
