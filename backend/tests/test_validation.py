from datetime import datetime, timedelta


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
