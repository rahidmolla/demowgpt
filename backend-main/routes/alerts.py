from fastapi import APIRouter,HTTPException
from models.schemas import WeatherRequest
from services.weather_service import get_weather
from services.alert_service import generate_alerts
from services.data_cleaner import clean_city
router=APIRouter(prefix='/alerts',tags=['Alerts'])
@router.post('/')
async def alerts(request:WeatherRequest):
 try:
  w=await get_weather(clean_city(request.city)); return {'success':True,'city':w['city'],**generate_alerts(w)}
 except Exception:raise HTTPException(500,'Unable to generate weather alerts')
