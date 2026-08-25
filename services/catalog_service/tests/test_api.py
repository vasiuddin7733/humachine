from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "catalog_service"}


def test_list_marketplaces() -> None:
    response = client.get("/api/v1/marketplaces")

    assert response.status_code == 200
    assert response.json() == ["amazon", "flipkart", "meesho"]


def test_create_product() -> None:
    response = client.post(
        "/api/v1/products",
        json={
            "title": "Desk Lamp",
            "category": "Home",
            "price": 39.99,
            "marketplaces": ["amazon", "flipkart"],
        },
    )

    body = response.json()

    assert response.status_code == 201
    assert body["title"] == "Desk Lamp"
    assert body["marketplaces"] == ["amazon", "flipkart"]


def test_update_product() -> None:
    created = client.post(
        "/api/v1/products",
        json={
            "title": "Kitchen Organizer",
            "category": "Home",
            "price": 19.99,
            "marketplaces": ["meesho"],
        },
    ).json()

    response = client.put(
        f"/api/v1/products/{created['id']}",
        json={"price": 24.99, "marketplaces": ["meesho", "flipkart"]},
    )

    body = response.json()

    assert response.status_code == 200
    assert body["price"] == 24.99
    assert body["marketplaces"] == ["meesho", "flipkart"]
