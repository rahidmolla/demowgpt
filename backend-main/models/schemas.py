from pydantic import BaseModel,Field
class WeatherRequest(BaseModel): city:str=Field(...,min_length=2,max_length=100)
class LocationRequest(BaseModel): city:str=Field(...,min_length=2,max_length=100)
