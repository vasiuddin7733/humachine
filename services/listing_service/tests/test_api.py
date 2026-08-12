from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "listing_service"}


def test_list_marketplaces() -> None:
    response = client.get("/api/v1/marketplaces")

    assert response.status_code == 200
    assert response.json() == ["amazon", "flipkart", "meesho"]


def test_create_listing() -> None:
    response = client.post(
        "/api/v1/listings",
        json={
            "product_id": 99,
            "sku": "SKU-HOME-199",
            "title": "Desk Lamp",
            "marketplace": "amazon",
            "price": 39.99,
        },
    )

    body = response.json()

    assert response.status_code == 201
    assert body["title"] == "Desk Lamp"
    assert body["marketplace"] == "amazon"
    assert body["status"] == "draft"


def test_publish_advances_status() -> None:
    created = client.post(
        "/api/v1/listings",
        json={
            "product_id": 88,
            "sku": "SKU-HOME-188",
            "title": "Kitchen Organizer",
            "marketplace": "flipkart",
            "price": 19.99,
        },
    ).json()

    listing_id = created["id"]

    ready = client.post(f"/api/v1/listings/{listing_id}/publish")
    assert ready.status_code == 200
    assert ready.json()["status"] == "ready"

    submitted = client.post(f"/api/v1/listings/{listing_id}/publish")
    assert submitted.status_code == 200
    body = submitted.json()
    assert body["status"] == "submitted"
    assert body["external_listing_id"].startswith("FK-MOCK-")

    active = client.post(f"/api/v1/listings/{listing_id}/publish")
    assert active.status_code == 200
    assert active.json()["status"] == "active"


def test_duplicate_listing_rejected() -> None:
    payload = {
        "product_id": 77,
        "sku": "SKU-HOME-177",
        "title": "Travel Mug",
        "marketplace": "meesho",
        "price": 14.99,
    }

    first = client.post("/api/v1/listings", json=payload)
    second = client.post("/api/v1/listings", json=payload)

    assert first.status_code == 201
    assert second.status_code == 400
    assert "already exists" in second.json()["detail"]
