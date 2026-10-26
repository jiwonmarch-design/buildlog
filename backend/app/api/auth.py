from datetime import timedelta

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.models.user import AuthSession, User, utc_now
from app.schemas.auth import (
    LoginRequest,
    NicknameUpdateRequest,
    SignupRequest,
    UserResponse,
)
from app.services.security import (
    create_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)

router = APIRouter(prefix="/api", tags=["auth"])
settings = get_settings()


def field_error(field: str, message: str, status_code: int = 409) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={"field": field, "message": message},
    )


@router.post(
    "/auth/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> User:
    duplicate = db.scalar(
        select(User).where(
            or_(User.email == str(payload.email), User.nickname == payload.nickname)
        )
    )
    if duplicate is not None:
        if duplicate.email == str(payload.email):
            raise field_error("email", "이미 사용 중인 이메일입니다.")
        raise field_error("nickname", "이미 사용 중인 닉네임입니다.")

    user = User(
        email=str(payload.email),
        password_hash=hash_password(payload.password),
        nickname=payload.nickname,
    )
    db.add(user)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"message": "이미 사용 중인 회원 정보입니다."},
        ) from error

    db.refresh(user)
    return user


@router.post("/auth/login", response_model=UserResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> User:
    user = db.scalar(select(User).where(User.email == str(payload.email)))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "이메일 또는 비밀번호가 맞지 않습니다."},
        )

    raw_token = create_session_token()
    expires_at = utc_now() + timedelta(days=settings.session_lifetime_days)
    db.add(
        AuthSession(
            token_hash=hash_session_token(raw_token),
            user_id=user.id,
            expires_at=expires_at,
        )
    )
    db.commit()

    response.set_cookie(
        key=settings.session_cookie_name,
        value=raw_token,
        max_age=settings.session_lifetime_days * 24 * 60 * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )
    return user


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    session_token: str | None = Cookie(
        default=None,
        alias=settings.session_cookie_name,
    ),
    db: Session = Depends(get_db),
) -> None:
    # The cookie is read directly because logout is also allowed for an expired session.
    if session_token:
        auth_session = db.scalar(
            select(AuthSession).where(
                AuthSession.token_hash == hash_session_token(session_token)
            )
        )
        if auth_session is not None:
            db.delete(auth_session)
            db.commit()

    response.delete_cookie(settings.session_cookie_name, path="/")


@router.get("/auth/me", response_model=UserResponse)
def read_current_user(user: User = Depends(get_current_user)) -> User:
    return user


@router.patch("/users/me/nickname", response_model=UserResponse)
def update_nickname(
    payload: NicknameUpdateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    duplicate = db.scalar(
        select(User).where(
            User.nickname == payload.nickname,
            User.id != user.id,
        )
    )
    if duplicate is not None:
        raise field_error("nickname", "이미 사용 중인 닉네임입니다.")

    user.nickname = payload.nickname

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise field_error("nickname", "이미 사용 중인 닉네임입니다.") from error

    db.refresh(user)
    return user
