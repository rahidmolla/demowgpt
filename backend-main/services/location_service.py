async def find_location(city):
 known={'kolkata':(22.5726,88.3639),'delhi':(28.6139,77.2090),'mumbai':(19.0760,72.8777),'bengaluru':(12.9716,77.5946)}
 lat,lon=known.get(city.lower(),(22.5726,88.3639)); return {'name':city.title(),'latitude':lat,'longitude':lon,'demo':True}
