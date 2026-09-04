// ===============================
// WeatherGPT - Forecast Page
// ===============================


// ---------- NAVIGATION ----------
console.log("new forecast is loaded");
function goHome() {
    window.location.href = "home.html";
}

function goAlerts() {
    window.location.href = "alerts.html";
}

function goProfile() {
    window.location.href = "profile.html";
}


// ---------- WEATHER ICON ----------

function getWeatherIcon(condition) {

    const icons = {
        "Clear": "☀️",
        "Clouds": "☁️",
        "Rain": "🌧️",
        "Drizzle": "🌦️",
        "Showers": "🌧️",
        "Fog": "🌫️",
        "Snow": "❄️",
        "Thunderstorm": "⛈️"
    };

    return icons[condition] || "🌤️";
}


// ---------- DATE FORMAT ----------

function formatDate(dateString) {

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}


// ---------- LOAD FORECAST ----------

async function loadForecast(city) {

    console.log("Loading forecast for:", city);

    const container = document.getElementById("forecastContainer");

    // Show loading message
    if (container) {
        container.innerHTML = `
            <p style="text-align:center; padding:20px;">
                Loading forecast...
            </p>
        `;
    }

    try {

        // Connect to backend
        const response = await fetch(
            "https://demowgpt.onrender.com/api/forecast/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    city: city
                })
            }
        );


        // Convert response to JSON
        const result = await response.json();


        // Check API response
        if (!response.ok) {

            throw new Error(
                result.detail || "Unable to load forecast"
            );
        }


        // Backend returns data inside result.data
        const data = result.data;


        console.log("Forecast API response:", data);


        // ---------- UPDATE CITY ----------

        const cityElement =
            document.getElementById("forecastCity");

        if (cityElement) {

            cityElement.textContent =
                `📍 ${data.city}`;
        }


        // ---------- CHECK FORECAST DATA ----------

        if (
            !data.forecast ||
            !Array.isArray(data.forecast) ||
            data.forecast.length === 0
        ) {

            throw new Error(
                "No forecast data received from server"
            );
        }


        // ---------- TODAY ----------

        const today = data.forecast[0];


        // Support the new ID
        const todayTemperature =
            document.getElementById(
                "forecastTodayTemperature"
            );


        // Also support the old ID if it still exists
        const oldTemperature =
            document.getElementById(
                "forecastTemperature"
            );


        if (todayTemperature) {

            todayTemperature.textContent =
                `${today.max_temp}°C`;

        } else if (oldTemperature) {

            oldTemperature.textContent =
                `${today.max_temp}°C`;
        }


        // ---------- TODAY CONDITION ----------

        const conditionElement =
            document.getElementById(
                "forecastCondition"
            );


        if (conditionElement) {

            conditionElement.textContent =
                `${today.description} ${getWeatherIcon(today.condition)}`;
        }


        // ---------- TODAY ICON ----------

        const todayIcon =
            document.getElementById(
                "forecastTodayIcon"
            );


        if (todayIcon) {

            todayIcon.textContent =
                getWeatherIcon(today.condition);
        }


        // ---------- FORECAST CONTAINER ----------

        if (!container) {

            throw new Error(
                "forecastContainer was not found in forecast.html"
            );
        }


        // Clear loading message
        container.innerHTML = "";


        // ---------- CREATE FORECAST CARDS ----------

        data.forecast.forEach((day, index) => {

            const card =
                document.createElement("div");

            card.className = "forecast-day";


            // First day = Today
            const dayName =
                index === 0
                    ? "Today"
                    : formatDate(day.date);


            card.innerHTML = `
                <div class="forecast-day-info">

                    <h3>${dayName}</h3>

                    <span>
                        ${day.description || day.condition}
                    </span>

                </div>


                <div class="forecast-day-icon">

                    ${getWeatherIcon(day.condition)}

                </div>


                <div class="forecast-day-temp">

                    <strong>
                        ${day.max_temp}°C
                    </strong>

                    <span>
                        ${day.min_temp}°C
                    </span>

                </div>


                <div class="forecast-day-rain">

                    💧 ${day.rain_probability}%

                </div>
            `;


            container.appendChild(card);

        });


        console.log(
            "Forecast loaded successfully for:",
            data.city
        );

    } catch (error) {

        console.error(
            "Forecast loading error:",
            error
        );


        if (container) {

            container.innerHTML = `
                <p style="
                    text-align:center;
                    padding:20px;
                    color:#d9534f;
                ">
                    Unable to load forecast.
                    <br>
                    Please make sure the backend is running.
                </p>
            `;
        }
    }
}


// ---------- GET SELECTED CITY FROM HOME ----------

const selectedCity =
    localStorage.getItem("selectedCity") ||
    "Kolkata";


console.log(
    "Selected city:",
    selectedCity
);


// ---------- START FORECAST ----------

loadForecast(selectedCity);


// ---------- CHANGE LOCATION FROM THIS PAGE ----------
// Tapping the city label lets you change location right here,
// and it stays in sync with home.html (same "selectedCity" key).

const forecastCityLabel =
    document.getElementById("forecastCity");

if (forecastCityLabel) {

    forecastCityLabel.addEventListener("click", () => {

        const newCity = prompt("Enter a city name:");

        if (newCity && newCity.trim() !== "") {

            localStorage.setItem(
                "selectedCity",
                newCity.trim()
            );

            loadForecast(newCity.trim());
        }
    });
}