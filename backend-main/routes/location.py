from fastapi import APIRouter,HTTPException
from models.schemas import LocationRequest
from services.location_service import find_location
from services.data_cleaner import clean_city
router=APIRouter(prefix='/location',tags=['Location'])
@router.post('/')
async def location(request:LocationRequest):
 try:return {'success':True,'location':await find_location(clean_city(request.city))}
 except Exception:raise HTTPException(500,'Unable to find location')
