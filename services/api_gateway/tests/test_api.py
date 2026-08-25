from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


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
    assert body["channels"]["amazon"]["listing_status"] == "draft"


def test_promote_requires_active_listing() -> None:
    created = client.post(
        "/api/v1/products",
        json={
            "title": "Kitchen Organizer",
            "category": "Home",
            "price": 19.99,
            "marketplaces": ["meesho"],
        },
    ).json()

    response = client.post(
        f"/api/v1/products/{created['id']}/promote",
        json={"marketplace": "meesho"},
    )

    assert response.status_code == 400
    assert "Listing must be active" in response.json()["detail"]


def test_upload_requires_images_and_content() -> None:
    response = client.post(
        "/api/v1/products/upload",
        json={
            "title": "Empty Upload",
            "category": "Home",
            "price": 12.0,
            "marketplaces": ["amazon"],
            "description": "",
            "image_urls": [],
        },
    )

    assert response.status_code == 400


def _mock_response(status_code: int, payload: dict) -> MagicMock:
    response = MagicMock()
    response.is_success = 200 <= status_code < 300
    response.status_code = status_code
    response.content = b"{}"
    response.text = str(payload)
    response.json.return_value = payload
    return response


def test_upload_fans_out_via_queue_and_tracks_status() -> None:
    listing_create = _mock_response(
        201,
        {
            "id": 501,
            "product_id": 99,
            "sku": "SKU-HOME-199",
            "title": "Travel Mug",
            "marketplace": "amazon",
            "price": 18.5,
            "status": "draft",
        },
    )
    listing_ready = _mock_response(200, {**listing_create.json.return_value, "status": "ready"})
    listing_submitted = _mock_response(
        200, {**listing_create.json.return_value, "status": "submitted"}
    )
    listing_active = _mock_response(
        200, {**listing_create.json.return_value, "status": "active"}
    )
    catalog_create = _mock_response(201, {"id": 77, "title": "Travel Mug"})
    campaign_create = _mock_response(201, {"id": 88, "status": "not_started"})
    job_create = _mock_response(201, {"id": 11, "status": "queued"})

    responses = [
        catalog_create,
        listing_create,
        listing_ready,
        listing_submitted,
        listing_active,
        campaign_create,
        job_create,
        job_create,
        job_create,
    ]

    with patch("app.agents.dispatch_agent.httpx.Client") as client_cls:
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.__exit__.return_value = False
        mock_client.post.side_effect = responses
        client_cls.return_value = mock_client

        response = client.post(
            "/api/v1/products/upload",
            json={
                "title": "Travel Mug",
                "category": "Home",
                "price": 18.5,
                "marketplaces": ["amazon"],
                "description": "Insulated travel mug with lid.",
                "image_urls": ["https://cdn.example.com/mug.jpg"],
                "daily_budget": 15.0,
                "auto_activate_listings": True,
            },
        )

    body = response.json()

    assert response.status_code == 201
    assert body["product"]["title"] == "Travel Mug"
    assert body["product"]["image_urls"] == ["https://cdn.example.com/mug.jpg"]
    assert body["run"]["status"] == "completed"
    services = [step["service"] for step in body["run"]["steps"]]
    assert services == [
        "catalog_service",
        "listing_service",
        "promotion_service",
        "worker_service",
    ]
    assert all(step["status"] == "completed" for step in body["run"]["steps"])

    status = client.get(f"/api/v1/ingestions/{body['run']['id']}")
    assert status.status_code == 200
    assert status.json()["status"] == "completed"
