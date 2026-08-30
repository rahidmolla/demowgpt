function goHome() {

    window.location.href =
        "home.html";

}


function goForecast() {

    window.location.href =
        "forecast.html";

 }

 function goProfile() {
    window.location.href = "profile.html";
}


/* GET ALERT ICON */

function getAlertIcon(type) {

    const icons = {

        "Normal": "✅",
        "Rain": "🌧️",
        "Thunderstorm": "⛈️",
        "Wind": "💨",
        "Heat": "☀️",
        "Cold": "🥶"

    };

    return icons[type] || "⚠️";

}


/* LOAD ALERTS */

async function loadAlerts(city = "Kolkata") {

    try {

        const response = await fetch(

            "http://127.0.0.1:8000/api/alerts/",

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


        const data = await response.json();


        if (!response.ok) {

            throw new Error(data.detail);

        }


        const container =

            document.getElementById(
                "alertsContainer"
            );


        container.innerHTML = "";


        data.alerts.forEach(

            (alert) => {

                const icon =

                    getAlertIcon(
                        alert.type
                    );


                const alertHTML = `

                    <div class="alert-card information">

                        <div class="alert-icon">

                            ${icon}

                        </div>


                        <div class="alert-content">

                            <div class="alert-heading">

                                <h3>
                                    ${alert.type}
                                </h3>

                                <span>
                                    ${alert.severity}
                                </span>

                            </div>


                            <p>
                                ${alert.message}
                            </p>


                            <small>
                                Today • ${data.city}
                            </small>

                        </div>

                    </div>

                `;


                container.innerHTML +=

                    alertHTML;

            }

        );


    } catch (error) {

        console.error(
            "Alerts loading error:",
            error
        );


        document.getElementById(
            "alertsContainer"
        ).innerHTML = `

            <p>
                Unable to load weather alerts.
            </p>

        `;

    }

}


/* LOAD ALERTS WHEN PAGE OPENS */

loadAlerts();