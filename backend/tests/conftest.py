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
SQLALCHEMY_DATABASE_URL = "sqlite:///./filmhouse.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False
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
    # Use the real database, but keep each test inside a rollback-only transaction.
    Base.metadata.create_all(bind=engine)

    connection = engine.connect()
    transaction = connection.begin()
    TestingSessionLocal.configure(bind=connection)

    db = TestingSessionLocal()

    try:
        # Seed or normalize the rows that tests depend on.
        db.query(User).filter(User.email == "tester2@example.com").delete(
            synchronize_session=False
        )

        admin = db.query(User).filter(User.email == "admin@filmhouse.com").first()
        if admin is None:
            admin = User(email="admin@filmhouse.com")
            db.add(admin)
        admin.username = "admin"
        admin.password_hash = hash_password("AdminPassword123")
        admin.role = "admin"

        regular_user = db.query(User).filter(User.email == "tester1@example.com").first()
        if regular_user is None:
            regular_user = User(email="tester1@example.com")
            db.add(regular_user)
        regular_user.username = "tester1"
        regular_user.password_hash = hash_password("Password1234")
        regular_user.role = "regular"

        movie = db.get(Movie, 1)
        if movie is None:
            movie = Movie(id=1)
            db.add(movie)
        movie.title = "Test Movie"
        movie.genre = "Drama"
        movie.age_rating = "12"
        movie.duration_minutes = 120
        movie.description = "A test movie for automated tests."
        movie.release_date = datetime.now().date()
        movie.poster_url = None

        screen = db.get(Screen, 1)
        if screen is None:
            screen = Screen(id=1)
            db.add(screen)
        screen.screen_name = "Screen 1"
        screen.capacity = 50
        screen.screen_type = "Standard"

        db.flush()

        showtime = db.get(Showtime, 1)
        if showtime is None:
            showtime = Showtime(id=1)
            db.add(showtime)
        showtime.movie_id = 1
        showtime.screen_id = 1
        showtime.start_time = datetime.now() + timedelta(days=1)
        showtime.ticket_price = 10.99
        showtime.available_seats = 50

        db.commit()
        db.close()

        app.dependency_overrides[get_db] = override_get_db

        # Test client lifecycle
        with TestClient(app) as test_client:
            yield test_client

    finally:
        app.dependency_overrides.clear()
        db.close()
        transaction.rollback()
        connection.close()


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
