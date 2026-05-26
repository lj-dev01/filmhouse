# Registration tests
def test_register_user_successfully(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "tester2",
            "email": "tester2@example.com",
            "password": "Password1234"
        }
    )

    assert response.status_code == 201
    assert response.json()["email"] == "tester2@example.com"
    assert response.json()["role"] == "regular"


def test_reject_duplicate_email(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "tester1",
            "email": "tester1@example.com",
            "password": "Password1234"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Email is already registered"


# Login tests
def test_login_successfully(client):
    response = client.post(
        "/auth/login",
        json={
            "email": "tester1@example.com",
            "password": "Password1234"
        }
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_reject_invalid_login(client):
    response = client.post(
        "/auth/login",
        json={
            "email": "tester1@example.com",
            "password": "WrongPassword123"
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
