# Movie create and read tests
def test_admin_can_create_movie(client, admin_headers, valid_movie_payload):
    response = client.post(
        "/movies/",
        json=valid_movie_payload,
        headers=admin_headers
    )

    assert response.status_code == 201
    assert response.json()["title"] == valid_movie_payload["title"]


def test_anyone_can_read_movies(client):
    response = client.get("/movies/")

    assert response.status_code == 200
    assert len(response.json()) >= 1


# Movie update and delete tests
def test_admin_can_update_movie(client, admin_headers):
    response = client.put(
        "/movies/1",
        json={
            "title": "Updated Test Movie"
        },
        headers=admin_headers
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Updated Test Movie"


def test_admin_can_delete_movie(client, admin_headers, valid_movie_payload):
    create_response = client.post(
        "/movies/",
        json=valid_movie_payload,
        headers=admin_headers
    )
    movie_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/movies/{movie_id}",
        headers=admin_headers
    )

    assert delete_response.status_code == 204

    get_response = client.get(f"/movies/{movie_id}")
    assert get_response.status_code == 404
