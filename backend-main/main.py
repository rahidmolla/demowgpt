from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.weather import router as weather_router
from routes.alerts import router as alerts_router
from routes.location import router as location_router
from routes.forecast import router as forecast_router


app = FastAPI(
    title="WeatherGPT Backend",
    version="1.0.0"
)


# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# WeatherGPT API routes
app.include_router(weather_router, prefix="/api")
app.include_router(alerts_router, prefix="/api")
app.include_router(location_router, prefix="/api")
app.include_router(forecast_router, prefix="/api")


# Home route
@app.get("/")
def home():
    return {
        "message": "WeatherGPT Backend is running",
        "status": "online"
    }


# Health route
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }