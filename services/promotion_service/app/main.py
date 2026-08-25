from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.campaigns import router as campaigns_router
from app.routers.health import router as health_router
from app.routers.marketplaces import router as marketplaces_router

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Promotion microservice for launching marketplace campaigns on Amazon, Flipkart, and Meesho.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(marketplaces_router, prefix=settings.api_prefix)
app.include_router(campaigns_router, prefix=settings.api_prefix)
