from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "worker_service"}


def test_list_marketplaces() -> None:
    response = client.get("/api/v1/marketplaces")

    assert response.status_code == 200
    assert response.json() == ["amazon", "flipkart", "meesho"]


def test_enqueue_sync_listing_job() -> None:
    response = client.post(
        "/api/v1/jobs",
        json={
            "job_type": "sync_listing",
            "product_id": 10,
            "listing_id": 20,
            "marketplace": "amazon",
            "sku": "SKU-HOME-110",
        },
    )

    body = response.json()

    assert response.status_code == 201
    assert body["job_type"] == "sync_listing"
    assert body["status"] == "queued"
    assert body["attempts"] == 0


def test_enqueue_sync_promotion_requires_campaign_id() -> None:
    response = client.post(
        "/api/v1/jobs",
        json={
            "job_type": "sync_promotion",
            "product_id": 10,
            "marketplace": "flipkart",
            "sku": "SKU-HOME-110",
        },
    )

    assert response.status_code == 400
    assert "campaign_id is required" in response.json()["detail"]


def test_run_job_advances_status() -> None:
    created = client.post(
        "/api/v1/jobs",
        json={
            "job_type": "inventory_sync",
            "product_id": 15,
            "marketplace": "meesho",
            "sku": "SKU-HOME-115",
        },
    ).json()

    job_id = created["id"]

    running = client.post(f"/api/v1/jobs/{job_id}/run")
    assert running.status_code == 200
    assert running.json()["status"] == "running"
    assert running.json()["attempts"] == 1

    completed = client.post(f"/api/v1/jobs/{job_id}/run")
    assert completed.status_code == 200
    body = completed.json()
    assert body["status"] == "completed"
    assert body["result_summary"] is not None


def test_retry_failed_job() -> None:
    created = client.post(
        "/api/v1/jobs",
        json={
            "job_type": "publish_retry",
            "product_id": 22,
            "listing_id": 33,
            "marketplace": "amazon",
            "sku": "SKU-HOME-122",
        },
    ).json()

    job_id = created["id"]

    from app.services.jobs import job_store

    job_store.fail_job(job_id, "Mock publish timeout")

    retried = client.post(f"/api/v1/jobs/{job_id}/retry")
    assert retried.status_code == 200
    assert retried.json()["status"] == "queued"
    assert retried.json()["last_error"] is None
