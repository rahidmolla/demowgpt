import asyncio
import time
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

    95: ("Thunderstorm", "Thunderstorm"),
    96: ("Thunderstorm", "Thunderstorm with slight hail"),
    99: ("Thunderstorm", "Thunderstorm with heavy hail"),
}


# Simple in-memory cache
# Keeps forecast data for 10 minutes.
forecast_cache = {}
CACHE_DURATION = 600


async def get_forecast(city):

    city_key = city.strip().lower()

    # -------------------------------------------------
    # 1. Check cache first
    # -------------------------------------------------
    cached = forecast_cache.get(city_key)

    if cached:
        cached_time, cached_data = cached

        if time.time() - cached_time < CACHE_DURATION:
            print(f"Using cached forecast for {city}")
            return cached_data

        # Remove expired cache
        del forecast_cache[city_key]

    # -------------------------------------------------
    # 2. Create HTTP client
    # -------------------------------------------------
    async with httpx.AsyncClient(timeout=20.0) as client:

        # -------------------------------------------------
        # 3. Get city coordinates
        # -------------------------------------------------
        geo_response = await client.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={
                "name": city,
                "count": 1,
                "language": "en",
                "format": "json",
            },
        )

        geo_response.raise_for_status()

        geo_data = geo_response.json()

        if not geo_data.get("results"):
            raise Exception(f"City not found: {city}")

        location = geo_data["results"][0]

        latitude = location["latitude"]
        longitude = location["longitude"]

        # -------------------------------------------------
        # 4. Request forecast with retry
        # -------------------------------------------------
        forecast_url = "https://api.open-meteo.com/v1/forecast"

        forecast_params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": (
                "weather_code,"
                "temperature_2m_max,"
                "temperature_2m_min,"
                "precipitation_probability_max"
            ),
            "timezone": "auto",
            "forecast_days": 10,
        }

        forecast_response = None

        for attempt in range(3):

            forecast_response = await client.get(
                forecast_url,
                params=forecast_params,
            )

            # Success
            if forecast_response.status_code == 200:
                break

            # Rate limited
            if forecast_response.status_code == 429:

                wait_time = 2 ** attempt

                print(
                    f"Open-Meteo rate limited request "
                    f"(429). Retrying in {wait_time} seconds..."
                )

                await asyncio.sleep(wait_time)
                continue

            # Other error
            forecast_response.raise_for_status()

        # If all retry attempts failed
        if forecast_response is None or forecast_response.status_code != 200:

            if forecast_response is not None:
                forecast_response.raise_for_status()

            raise Exception(
                "Open-Meteo forecast service is temporarily unavailable."
            )

        forecast_data = forecast_response.json()

        # -------------------------------------------------
        # 5. Process daily forecast
        # -------------------------------------------------
        daily = forecast_data["daily"]

        forecast = []

        for i in range(len(daily["time"])):

            weather_code = daily["weather_code"][i]

            condition, description = WEATHER_CODES.get(
                weather_code,
                ("Unknown", "Weather unavailable")
            )

            forecast.append(
                {
                    "date": daily["time"][i],
                    "max_temp": daily["temperature_2m_max"][i],
                    "min_temp": daily["temperature_2m_min"][i],
                    "condition": condition,
                    "description": description,
                    "rain_probability": (
                        daily["precipitation_probability_max"][i]
                    ),
                }
            )

        # -------------------------------------------------
        # 6. Create final response
        # -------------------------------------------------
        result = {
            "city": location["name"],
            "country": location.get("country", ""),
            "forecast": forecast,
        }

        # -------------------------------------------------
        # 7. Save result in cache
        # -------------------------------------------------
        forecast_cache[city_key] = (
            time.time(),
            result
        )

        return result