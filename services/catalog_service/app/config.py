from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "humachine ecommerce Catalog Service"
    api_prefix: str = "/api/v1"
    environment: str = "development"
    allowed_origins: list[str] = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8002",
        "http://127.0.0.1:8002",
    ]

    model_config = SettingsConfigDict(env_prefix="CATALOG_SERVICE_", case_sensitive=False)


settings = Settings()
