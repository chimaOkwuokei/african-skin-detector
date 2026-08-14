from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.core.database import init_db
from app.routers import analysis, clinic, feedback, patient, specialist


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="IleraDerma Demo", lifespan=lifespan)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["health"])
def root():
    """Confirms the API is up. Also for health check."""
    return {
        "service": "IleraDerma API",
        "status": "ok",
        "docs": "/docs",
    }


app.include_router(patient.router)
app.include_router(clinic.router)
app.include_router(analysis.router)
app.include_router(feedback.router)
app.include_router(feedback.feed_router)
app.include_router(specialist.router)
