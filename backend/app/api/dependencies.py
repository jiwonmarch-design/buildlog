from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.models.user import AuthSession, User, utc_now
from app.services.security import hash_session_token

settings = get_settings()


def get_current_user(
    session_token: str | None = Cookie(
        default=None,
        alias=settings.session_cookie_name,
    ),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"message": "로그인이 필요합니다."},
    )

    if not session_token:
        raise unauthorized

    auth_session = db.scalar(
        select(AuthSession).where(
            AuthSession.token_hash == hash_session_token(session_token)
        )
    )

    if auth_session is None:
        raise unauthorized

    if auth_session.expires_at <= utc_now():
        db.delete(auth_session)
        db.commit()
        raise unauthorized

    return auth_session.user
