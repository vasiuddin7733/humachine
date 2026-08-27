from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "humachine ecommerce API Gateway"
    api_prefix: str = "/api/v1"
    environment: str = "development"
    port: int = 8001
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://vasiuddin7733.github.io",
    ]
    catalog_service_url: str = "http://127.0.0.1:8002"
    listing_service_url: str = "http://127.0.0.1:8003"
    promotion_service_url: str = "http://127.0.0.1:8004"
    worker_service_url: str = "http://127.0.0.1:8005"
    orchestration_enabled: bool = True
    http_timeout_seconds: float = 10.0
    queue_backend: str = "memory"
    redis_url: str = "redis://127.0.0.1:6379/0"
    queue_name: str = "humachine.ingestion"

    model_config = SettingsConfigDict(env_prefix="API_GATEWAY_", case_sensitive=False)


settings = Settings()
