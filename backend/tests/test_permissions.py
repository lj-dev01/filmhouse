# Admin route permission tests
def test_regular_user_cannot_access_admin_movie_create(client, user_headers, valid_movie_payload):
    response = client.post(
        "/movies/",
        json=valid_movie_payload,
        headers=user_headers
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_admin_can_access_admin_movie_create(client, admin_headers, valid_movie_payload):
    response = client.post(
        "/movies/",
        json=valid_movie_payload,
        headers=admin_headers
    )

    assert response.status_code == 201
    assert response.json()["title"] == valid_movie_payload["title"]


# Booking permission tests
def test_admin_cannot_create_customer_booking(client, admin_headers):
    response = client.post(
        "/bookings/",
        json={
            "showtime_id": 1,
            "number_of_tickets": 1
        },
        headers=admin_headers
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admins cannot create customer bookings"
