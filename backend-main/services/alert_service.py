def generate_alerts(w):
 a=[]; t=w.get('temperature'); wind=w.get('wind_speed'); c=str(w.get('condition','')).lower()
 if t is not None and t>=40:a.append({'type':'Extreme Heat','severity':'High','message':'Very high temperature. Avoid prolonged outdoor activity.'})
 if wind is not None and wind>=15:a.append({'type':'Strong Wind','severity':'Moderate','message':'Strong winds are expected. Take caution outdoors.'})
 if 'thunderstorm' in c:a.append({'type':'Thunderstorm','severity':'High','message':'Thunderstorm conditions detected. Stay indoors if possible.'})
 if 'rain' in c:a.append({'type':'Rain','severity':'Moderate','message':'Rain is currently reported. Carry an umbrella.'})
 if not a:a.append({'type':'Normal','severity':'Low','message':'No major weather alert detected.'})
 rank={'Low':1,'Moderate':2,'High':3,'Critical':4}; return {'alert_level':max(a,key=lambda x:rank[x['severity']])['severity'],'alerts':a}
