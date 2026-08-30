function goHome() {

    window.location.href =
        "home.html";

}


function goAlerts() {

    window.location.href =
        "alerts.html";

}

function goProfile() {
    window.location.href = "profile.html";
}


/* WEATHER ICON */

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


/* LOAD FORECAST */

async function loadForecast(city) {

    try {

        const response = await fetch(

            "http://127.0.0.1:8000/api/forecast/",

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


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Unable to load forecast"
            );

        }


        const data =
            result.data;


        /* UPDATE CITY */

        document
            .getElementById("forecastCity")
            .textContent =
            `📍 ${data.city}`;


        /* FIRST DAY SUMMARY */

        const today =
            data.forecast[0];


        document
            .getElementById("forecastTemperature")
            .textContent =
            `${today.max_temp}°C`;


        document
            .getElementById("forecastCondition")
            .textContent =
            `${today.description} ${getWeatherIcon(today.condition)}`;


        /* FORECAST LIST */

        const container =
            document.getElementById(
                "forecastContainer"
            );


        container.innerHTML = "";


        data.forecast.forEach(

            (day, index) => {

                const date =
                    new Date(day.date);


                const dayName =

                    index === 0

                        ? "Today"

                        : date.toLocaleDateString(

                            "en-US",

                            {

                                weekday: "short"

                            }

                        );


                const formattedDate =

                    date.toLocaleDateString(

                        "en-US",

                        {

                            month: "short",

                            day: "numeric"

                        }

                    );


                const icon =
                    getWeatherIcon(
                        day.condition
                    );


                const forecastHTML = `

                    <div class="forecast-day">

                        <div class="day">

                            <strong>
                                ${dayName}
                            </strong>

                            <small>
                                ${formattedDate}
                            </small>

                        </div>


                        <div class="forecast-icon">

                            ${icon}

                        </div>


                        <div class="condition">

                            ${day.description}

                        </div>


                        <div class="temps">

                            <strong>
                                ${day.max_temp}°
                            </strong>

                            <span>
                                ${day.min_temp}°
                            </span>

                        </div>

                    </div>

                `;


                container.innerHTML +=
                    forecastHTML;

            }

        );


    } catch (error) {

        console.error(
            "Forecast loading error:",
            error
        );

    }

}


/* GET SELECTED CITY */

const selectedCity =
    localStorage.getItem(
        "selectedCity"
    ) || "Kolkata";


console.log(
    "Selected city:",
    selectedCity
);


/* LOAD FORECAST */

loadForecast(
    selectedCity
);