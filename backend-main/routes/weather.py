from fastapi import APIRouter,HTTPException
from models.schemas import WeatherRequest
from services.weather_service import get_weather
from services.data_cleaner import clean_city
router=APIRouter(prefix='/weather',tags=['Weather'])
@router.post('/')
async def weather(request:WeatherRequest):
 try:return {'success':True,'data':await get_weather(clean_city(request.city))}
 except Exception:raise HTTPException(500,'Unable to retrieve weather data')
