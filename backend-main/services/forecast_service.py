import httpx


WEATHER_CODES = {
    0: ("Clear", "Clear sky"),
    1: ("Clear", "Mainly clear"),
    2: ("Clouds", "Partly cloudy"),
    3: ("Clouds", "Overcast"),
    45: ("Fog", "Foggy"),
    48: ("Fog", "Foggy"),
    51: ("Drizzle", "Light drizzle"),
    53: ("Drizzle", "Moderate drizzle"),
    55: ("Drizzle", "Heavy drizzle"),
    61: ("Rain", "Light rain"),
    63: ("Rain", "Moderate rain"),
    65: ("Rain", "Heavy rain"),
    71: ("Snow", "Light snow"),
    73: ("Snow", "Moderate snow"),
    75: ("Snow", "Heavy snow"),
    80: ("Showers", "Light showers"),
    81: ("Showers", "Moderate showers"),
    82: ("Showers", "Heavy showers"),
    95: ("Thunderstorm", "Thunderstorm")
}


async def get_forecast(city):

    async with httpx.AsyncClient() as client:

        # Find city coordinates
        geo_response = await client.get(
            "https://geocoding-api.open-meteo.com/v1/search",
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

        # Get 10-day forecast
        forecast_response = await client.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": latitude,
                "longitude": longitude,
                "daily": (
                    "weather_code,"
                    "temperature_2m_max,"
                    "temperature_2m_min,"
                    "precipitation_probability_max"
                ),
                "timezone": "auto",
                "forecast_days": 10
            }
        )

        forecast_response.raise_for_status()

        forecast_data = forecast_response.json()

        daily = forecast_data["daily"]

        forecast = []

        for i in range(len(daily["time"])):

            weather_code = daily["weather_code"][i]

            condition, description = WEATHER_CODES.get(
                weather_code,
                ("Unknown", "Weather unavailable")
            )

            forecast.append({
                "date": daily["time"][i],
                "max_temp": daily["temperature_2m_max"][i],
                "min_temp": daily["temperature_2m_min"][i],
                "condition": condition,
                "description": description,
                "rain_probability":
                    daily["precipitation_probability_max"][i]
            })

        return {
            "city": location["name"],
            "country": location.get("country", ""),
            "forecast": forecast
        }