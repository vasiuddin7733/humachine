from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Humachine Promotion Service"
    api_prefix: str = "/api/v1"
    environment: str = "development"
    port: int = 8004
    allowed_origins: list[str] = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8001",
        "http://127.0.0.1:8001",
    ]

    model_config = SettingsConfigDict(env_prefix="PROMOTION_SERVICE_", case_sensitive=False)


settings = Settings()
