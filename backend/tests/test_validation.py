from datetime import datetime, timedelta

from conftest import TestingSessionLocal
from models.showtime import Showtime


# Movie validation tests
def test_reject_movie_with_negative_duration(client, admin_headers, valid_movie_payload):
    invalid_movie = {
        **valid_movie_payload,
        "duration_minutes": -120
    }

    response = client.post(
        "/movies/",
        json=invalid_movie,
        headers=admin_headers
    )

    assert response.status_code == 422


def test_reject_movie_with_empty_title(client, admin_headers, valid_movie_payload):
    invalid_movie = {
        **valid_movie_payload,
        "title": "   "
    }

    response = client.post(
        "/movies/",
        json=invalid_movie,
        headers=admin_headers
    )

    assert response.status_code == 422


# Showtime validation tests
def test_reject_showtime_in_the_past(client, admin_headers):
    response = client.post(
        "/showtimes/",
        json={
            "movie_id": 1,
            "screen_id": 1,
            "start_time": (datetime.now() - timedelta(days=1)).isoformat(),
            "ticket_price": 10.99,
            "available_seats": 50
        },
        headers=admin_headers
    )

    assert response.status_code == 422


def test_reject_showtime_when_screen_is_already_booked(client, admin_headers):
    db = TestingSessionLocal()

    try:
        existing_showtime = db.query(Showtime).first()
        start_time = existing_showtime.start_time
    finally:
        db.close()

    response = client.post(
        "/showtimes/",
        json={
            "movie_id": 1,
            "screen_id": 1,
            "start_time": start_time.isoformat(),
            "ticket_price": 10.99,
            "available_seats": 50
        },
        headers=admin_headers
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "This screen already has a showtime at that date and time."
    )


def test_reject_showtime_update_when_screen_is_already_booked(client, admin_headers):
    db = TestingSessionLocal()

    try:
        existing_showtime = db.query(Showtime).first()
        showtime_to_update = Showtime(
            movie_id=1,
            screen_id=1,
            start_time=datetime.now() + timedelta(days=2),
            ticket_price=10.99,
            available_seats=50
        )

        db.add(showtime_to_update)
        db.commit()
        db.refresh(showtime_to_update)

        showtime_id = showtime_to_update.id
        conflicting_start_time = existing_showtime.start_time
    finally:
        db.close()

    response = client.put(
        f"/showtimes/{showtime_id}",
        json={
            "start_time": conflicting_start_time.isoformat()
        },
        headers=admin_headers
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "This screen already has a showtime at that date and time."
    )


# Screen validation tests
def test_reject_screen_with_negative_capacity(client, admin_headers):
    response = client.post(
        "/screens/",
        json={
            "screen_name": "Screen 2",
            "capacity": -50,
            "screen_type": "Standard"
        },
        headers=admin_headers
    )

    assert response.status_code == 422


# User validation tests
def test_reject_weak_password_on_register(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "tester2",
            "email": "tester2@example.com",
            "password": "password1234"
        }
    )

    assert response.status_code == 422
