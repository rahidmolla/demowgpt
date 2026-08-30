import httpx


WEATHER_CODES = {
    0: ("Clear", "Clear sky"),
    1: ("Clear", "Mainly clear"),
    2: ("Clouds", "Partly cloudy"),
    3: ("Clouds", "Overcast"),
    45: ("Fog", "Foggy"),
    48: ("Fog", "Depositing rime fog"),
    51: ("Drizzle", "Light drizzle"),
    53: ("Drizzle", "Moderate drizzle"),
    55: ("Drizzle", "Dense drizzle"),
    61: ("Rain", "Slight rain"),
    63: ("Rain", "Moderate rain"),
    65: ("Rain", "Heavy rain"),
    71: ("Snow", "Slight snow"),
    73: ("Snow", "Moderate snow"),
    75: ("Snow", "Heavy snow"),
    80: ("Rain showers", "Slight rain showers"),
    81: ("Rain showers", "Moderate rain showers"),
    82: ("Rain showers", "Violent rain showers"),
    95: ("Thunderstorm", "Thunderstorm")
}


async def get_weather(city):
    async with httpx.AsyncClient() as client:

        # Step 1: Convert city name into latitude and longitude
        geo_url = "https://geocoding-api.open-meteo.com/v1/search"

        geo_response = await client.get(
            geo_url,
            params={
                "name": city,
                "count": 1,
                "language": "en",
                "format": "json"
            }
        )

        geo_response.raise_for_status()
        geo_data = geo_response.json()

        if not geo_data.get("results"):
            raise Exception("City not found")

        location = geo_data["results"][0]

        latitude = location["latitude"]
        longitude = location["longitude"]

        # Step 2: Get real weather data
        weather_url = "https://api.open-meteo.com/v1/forecast"

        weather_response = await client.get(
            weather_url,
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
            }
        )

        weather_response.raise_for_status()
        weather_data = weather_response.json()

        current = weather_data["current"]

        weather_code = current["weather_code"]

        condition, description = WEATHER_CODES.get(
            weather_code,
            ("Unknown", "Weather information unavailable")
        )

        return {
            "city": location["name"],
            "country": location.get("country", ""),
            "temperature": current["temperature_2m"],
            "feels_like": current["apparent_temperature"],
            "humidity": current["relative_humidity_2m"],
            "wind_speed": current["wind_speed_10m"],
            "condition": condition,
            "description": description,
            "demo": False
        }