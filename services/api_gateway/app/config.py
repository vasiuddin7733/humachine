from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Humachine API Gateway"
    api_prefix: str = "/api/v1"
    environment: str = "development"
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    model_config = SettingsConfigDict(env_prefix="API_GATEWAY_", case_sensitive=False)


settings = Settings()
