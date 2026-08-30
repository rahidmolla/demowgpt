def clean_city(city): return ' '.join(city.strip().split())
def clean_weather_data(data):
 w=data.get('weather',[]); return {'city':data.get('name'),'country':data.get('sys',{}).get('country'),'temperature':data.get('main',{}).get('temp'),'feels_like':data.get('main',{}).get('feels_like'),'humidity':data.get('main',{}).get('humidity'),'wind_speed':data.get('wind',{}).get('speed'),'condition':w[0].get('main') if w else None,'description':w[0].get('description') if w else None}
