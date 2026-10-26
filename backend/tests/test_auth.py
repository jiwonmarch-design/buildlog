import asyncio

from httpx import ASGITransport, AsyncClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session, sessionmaker

from app.main import app
from app.models.user import AuthSession, User


async def signup(
    client: AsyncClient,
    *,
    email: str = "student@example.com",
    password: str = "password123",
    nickname: str = "학습자",
):
    return await client.post(
        "/api/auth/signup",
        json={"email": email, "password": password, "nickname": nickname},
    )


def test_signup_stores_normalized_user_and_hashed_password(
    test_database: sessionmaker[Session],
) -> None:
    async def scenario() -> None:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as client:
            response = await signup(
                client,
                email="  Student@Example.com  ",
                nickname="  학습자  ",
            )

        assert response.status_code == 201
        assert response.json() == {
            "id": 1,
            "email": "student@example.com",
            "nickname": "학습자",
            "is_admin": False,
        }
        assert "buildlog_session" not in response.cookies

    asyncio.run(scenario())

    with test_database() as db:
        user = db.scalar(select(User))
        assert user is not None
        assert user.password_hash != "password123"
        assert "password123" not in user.password_hash


def test_signup_rejects_invalid_boundaries(
    test_database: sessionmaker[Session],
) -> None:
    async def scenario() -> None:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as client:
            short_password = await signup(
                client,
                email="short@example.com",
                password="1234567",
                nickname="짧은암호",
            )
            long_password = await signup(
                client,
                email="long@example.com",
                password="a" * 65,
                nickname="긴암호",
            )
            invalid_nickname = await signup(
                client,
                email="nickname@example.com",
                nickname="bad-name",
            )
            invalid_email = await signup(
                client,
                email="not-an-email",
                nickname="이메일검사",
            )

        assert short_password.status_code == 422
        assert long_password.status_code == 422
        assert invalid_nickname.status_code == 422
        assert invalid_email.status_code == 422

    asyncio.run(scenario())

    with test_database() as db:
        assert db.scalar(select(func.count()).select_from(User)) == 0


def test_signup_rejects_duplicate_email_and_nickname(
    test_database: sessionmaker[Session],
) -> None:
    async def scenario() -> None:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as client:
            assert (await signup(client)).status_code == 201
            duplicate_email = await signup(
                client,
                nickname="다른닉네임",
            )
            duplicate_nickname = await signup(
                client,
                email="other@example.com",
            )

        assert duplicate_email.status_code == 409
        assert duplicate_email.json()["detail"]["field"] == "email"
        assert duplicate_nickname.status_code == 409
        assert duplicate_nickname.json()["detail"]["field"] == "nickname"

    asyncio.run(scenario())


def test_login_me_and_logout_lifecycle(
    test_database: sessionmaker[Session],
) -> None:
    async def scenario() -> None:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as client:
            assert (await signup(client)).status_code == 201

            wrong_login = await client.post(
                "/api/auth/login",
                json={"email": "student@example.com", "password": "wrongpass"},
            )
            assert wrong_login.status_code == 401

            login = await client.post(
                "/api/auth/login",
                json={
                    "email": "student@example.com",
                    "password": "password123",
                },
            )
            assert login.status_code == 200
            assert client.cookies.get("buildlog_session")

            me = await client.get("/api/auth/me")
            assert me.status_code == 200
            assert me.json()["nickname"] == "학습자"

            logout = await client.post("/api/auth/logout")
            assert logout.status_code == 204
            assert client.cookies.get("buildlog_session") is None

            after_logout = await client.get("/api/auth/me")
            assert after_logout.status_code == 401

    asyncio.run(scenario())

    with test_database() as db:
        assert db.scalar(select(func.count()).select_from(AuthSession)) == 0


def test_private_endpoint_requires_login(
    test_database: sessionmaker[Session],
) -> None:
    async def scenario() -> None:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as client:
            response = await client.get("/api/auth/me")

        assert response.status_code == 401

    asyncio.run(scenario())


def test_user_can_change_only_their_nickname(
    test_database: sessionmaker[Session],
) -> None:
    async def scenario() -> None:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as first_client:
            assert (await signup(first_client)).status_code == 201
            await first_client.post(
                "/api/auth/login",
                json={
                    "email": "student@example.com",
                    "password": "password123",
                },
            )
            changed = await first_client.patch(
                "/api/users/me/nickname",
                json={"nickname": "새닉네임"},
            )
            assert changed.status_code == 200
            assert changed.json()["nickname"] == "새닉네임"

            invalid = await first_client.patch(
                "/api/users/me/nickname",
                json={"nickname": "x"},
            )
            assert invalid.status_code == 422

        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as second_client:
            assert (
                await signup(
                    second_client,
                    email="second@example.com",
                    nickname="두번째",
                )
            ).status_code == 201
            await second_client.post(
                "/api/auth/login",
                json={"email": "second@example.com", "password": "password123"},
            )
            duplicate = await second_client.patch(
                "/api/users/me/nickname",
                json={"nickname": "새닉네임"},
            )
            assert duplicate.status_code == 409

    asyncio.run(scenario())
