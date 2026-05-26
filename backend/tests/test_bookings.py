from database.database import get_db
from main import app
from models.showtime import Showtime


# Booking creation tests
def test_regular_user_can_create_booking(client, user_headers):
    response = client.post(
        "/bookings/",
        json={
            "showtime_id": 1,
            "number_of_tickets": 2
        },
        headers=user_headers
    )

    assert response.status_code == 201
    assert response.json()["number_of_tickets"] == 2
    assert response.json()["booking_status"] == "active"


def test_reject_booking_with_zero_tickets(client, user_headers):
    response = client.post(
        "/bookings/",
        json={
            "showtime_id": 1,
            "number_of_tickets": 0
        },
        headers=user_headers
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Number of tickets must be greater than 0"


def test_reject_booking_when_tickets_exceed_available_seats(client, user_headers):
    response = client.post(
        "/bookings/",
        json={
            "showtime_id": 1,
            "number_of_tickets": 51
        },
        headers=user_headers
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Not enough seats available"


# Booking cancellation tests
def test_cancel_booking_restores_available_seats(client, user_headers):
    create_response = client.post(
        "/bookings/",
        json={
            "showtime_id": 1,
            "number_of_tickets": 3
        },
        headers=user_headers
    )
    booking_id = create_response.json()["id"]

    db = next(app.dependency_overrides[get_db]())
    seats_after_booking = db.query(Showtime).filter(Showtime.id == 1).first().available_seats
    db.close()

    cancel_response = client.put(
        f"/bookings/{booking_id}/cancel",
        headers=user_headers
    )

    db = next(app.dependency_overrides[get_db]())
    seats_after_cancel = db.query(Showtime).filter(Showtime.id == 1).first().available_seats
    db.close()

    assert cancel_response.status_code == 200
    assert seats_after_booking == 47
    assert seats_after_cancel == 50
