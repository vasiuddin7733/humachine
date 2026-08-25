from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "promotion_service"}


def test_list_marketplaces() -> None:
    response = client.get("/api/v1/marketplaces")

    assert response.status_code == 200
    assert response.json() == ["amazon", "flipkart", "meesho"]


def test_create_campaign() -> None:
    response = client.post(
        "/api/v1/campaigns",
        json={
            "product_id": 99,
            "listing_id": 99,
            "sku": "SKU-HOME-199",
            "title": "Desk Lamp",
            "marketplace": "amazon",
            "daily_budget": 15.0,
            "listing_is_active": True,
        },
    )

    body = response.json()

    assert response.status_code == 201
    assert body["title"] == "Desk Lamp"
    assert body["marketplace"] == "amazon"
    assert body["status"] == "not_started"


def test_create_campaign_requires_active_listing() -> None:
    response = client.post(
        "/api/v1/campaigns",
        json={
            "product_id": 50,
            "listing_id": 50,
            "sku": "SKU-HOME-150",
            "title": "Draft Product",
            "marketplace": "meesho",
            "daily_budget": 10.0,
            "listing_is_active": False,
        },
    )

    assert response.status_code == 400
    assert "Listing must be active" in response.json()["detail"]


def test_launch_advances_status() -> None:
    created = client.post(
        "/api/v1/campaigns",
        json={
            "product_id": 88,
            "listing_id": 88,
            "sku": "SKU-HOME-188",
            "title": "Kitchen Organizer",
            "marketplace": "flipkart",
            "daily_budget": 18.0,
            "listing_is_active": True,
        },
    ).json()

    campaign_id = created["id"]

    scheduled = client.post(f"/api/v1/campaigns/{campaign_id}/launch")
    assert scheduled.status_code == 200
    body = scheduled.json()
    assert body["status"] == "scheduled"
    assert body["external_campaign_id"].startswith("FK-ADS-")

    live = client.post(f"/api/v1/campaigns/{campaign_id}/launch")
    assert live.status_code == 200
    assert live.json()["status"] == "live"


def test_duplicate_campaign_rejected() -> None:
    payload = {
        "product_id": 77,
        "listing_id": 77,
        "sku": "SKU-HOME-177",
        "title": "Travel Mug",
        "marketplace": "meesho",
        "daily_budget": 12.0,
        "listing_is_active": True,
    }

    first = client.post("/api/v1/campaigns", json=payload)
    second = client.post("/api/v1/campaigns", json=payload)

    assert first.status_code == 201
    assert second.status_code == 400
    assert "already exists" in second.json()["detail"]
