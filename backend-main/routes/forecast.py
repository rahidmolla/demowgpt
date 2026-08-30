from fastapi import APIRouter, HTTPException

from models.schemas import LocationRequest

from services.forecast_service import get_forecast

from services.data_cleaner import clean_city


router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"]
)


@router.post("/")

async def forecast(request: LocationRequest):

    try:

        data = await get_forecast(
            clean_city(request.city)
        )

        return {
            "success": True,
            "data": data
        }

    except Exception as e:

        print("Forecast error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve forecast data"
        )