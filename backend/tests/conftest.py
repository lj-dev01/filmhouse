from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database.database import Base, get_db
from main import app
from models.movie import Movie
from models.screen import Screen
from models.showtime import Showtime
from models.user import User
from services.auth_service import hash_password


# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_filmhouse.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Database dependency override
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client():
    # Reset test database
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    # Seed test users
    admin = User(
        username="admin",
        email="admin@filmhouse.com",
        password_hash=hash_password("AdminPassword123"),
        role="admin"
    )

    regular_user = User(
        username="tester1",
        email="tester1@example.com",
        password_hash=hash_password("Password1234"),
        role="regular"
    )

    # Seed test movie and screen
    movie = Movie(
        title="Test Movie",
        genre="Drama",
        age_rating="12",
        duration_minutes=120,
        description="A test movie for automated tests.",
        release_date=datetime.now().date(),
        poster_url=None
    )

    screen = Screen(
        screen_name="Screen 1",
        capacity=50,
        screen_type="Standard"
    )

    db.add_all([admin, regular_user, movie, screen])
    db.commit()

    # Seed test showtime
    showtime = Showtime(
        movie_id=movie.id,
        screen_id=screen.id,
        start_time=datetime.now() + timedelta(days=1),
        ticket_price=10.99,
        available_seats=50
    )

    db.add(showtime)
    db.commit()
    db.close()

    app.dependency_overrides[get_db] = override_get_db

    # Test client lifecycle
    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def admin_headers(client):
    # Admin authentication header
    response = client.post(
        "/auth/login",
        json={
            "email": "admin@filmhouse.com",
            "password": "AdminPassword123"
        }
    )

    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def user_headers(client):
    # Regular user authentication header
    response = client.post(
        "/auth/login",
        json={
            "email": "tester1@example.com",
            "password": "Password1234"
        }
    )

    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def valid_movie_payload():
    # Reusable valid movie payload
    return {
        "title": "New Test Movie",
        "genre": "Action",
        "age_rating": "12A",
        "duration_minutes": 110,
        "description": "A valid movie created during automated testing.",
        "release_date": "2026-01-01",
        "poster_url": None
    }
