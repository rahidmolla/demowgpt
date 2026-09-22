/* =========================================================
   WEATHERGPT - ALERTS PAGE
   ========================================================= */


/* =========================
   NAVIGATION
   ========================= */

function goHome() {
    window.location.href = "home.html";
}


function goForecast() {
    window.location.href = "forecast.html";
}


function goProfile() {
    window.location.href = "profile.html";
}


/* =========================================================
   GET ALERT ICON
   ========================================================= */

function getAlertIcon(type) {

    const icons = {

        "Normal": "✅",

        "Rain": "🌧️",

        "Thunderstorm": "⛈️",

        "Strong Wind": "💨",

        "Extreme Heat": "☀️",

        "Cold": "🥶"

    };

    return icons[type] || "⚠️";
}


/* =========================================================
   GET ALERT CARD CLASS
   ========================================================= */

function getAlertClass(severity) {

    if (severity === "High" || severity === "Critical") {
        return "caution";
    }

    if (severity === "Moderate") {
        return "warning";
    }

    return "information";
}


/* =========================================================
   LOAD ALERTS
   ========================================================= */

async function loadAlerts(city) {

    const container =
        document.getElementById("alertsContainer");


    /* Safety check */

    if (!container) {

        console.error(
            "alertsContainer was not found in alerts.html"
        );

        return;
    }


    /* -----------------------------------------
       GET SELECTED CITY FROM HOME PAGE
       ----------------------------------------- */

    const selectedCity =
        city ||
        localStorage.getItem("selectedCity") ||
        "Kolkata";


    console.log(
        "Selected city for alerts:",
        selectedCity
    );


    /* Show loading message */

    container.innerHTML = `
        <p
            style="
                text-align:center;
                color:#888;
                padding:20px 0;
            "
        >
            Loading weather alerts...
        </p>
    `;


    try {

        /* -----------------------------------------
           CALL BACKEND
           ----------------------------------------- */

        const response = await fetch(

            "https://demowgpt.onrender.com/api/alerts/",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    city: selectedCity

                })

            }

        );


        /* -----------------------------------------
           READ RESPONSE
           ----------------------------------------- */

        const data =
            await response.json();


        console.log(
            "Alerts API response:",
            data
        );


        /* -----------------------------------------
           HANDLE BACKEND ERROR
           ----------------------------------------- */

        if (!response.ok) {

            throw new Error(

                data.detail ||
                "Unable to load weather alerts"

            );

        }


        /* -----------------------------------------
           CLEAR LOADING MESSAGE
           ----------------------------------------- */

        container.innerHTML = "";


        /* -----------------------------------------
           CHECK ALERT DATA
           ----------------------------------------- */

        const alerts =
            Array.isArray(data.alerts)
                ? data.alerts
                : [];


        /* =================================================
           NO ALERTS
           ================================================= */

        if (alerts.length === 0) {

            container.innerHTML = `

                <div
                    class="all-clear"
                    style="margin:0 0 12px 0;"
                >

                    <span>✓</span>

                    <p>
                        No major weather alerts for
                        ${selectedCity}.
                    </p>

                </div>

            `;

            console.log(
                "No weather alerts for:",
                selectedCity
            );

            return;
        }


        /* =================================================
           CREATE ALERT CARDS
           ================================================= */

        alerts.forEach(function(alert) {

            const type =
                alert.type || "Weather Alert";


            const severity =
                alert.severity || "Information";


            const message =
                alert.message ||
                "Weather conditions require attention.";


            const icon =
                getAlertIcon(type);


            const cardClass =
                getAlertClass(severity);


            const alertHTML = `

                <div
                    class="alert-card ${cardClass}"
                >

                    <div class="alert-icon">

                        ${icon}

                    </div>


                    <div class="alert-content">

                        <div class="alert-heading">

                            <h3>
                                ${type}
                            </h3>

                            <span>
                                ${severity}
                            </span>

                        </div>


                        <p>
                            ${message}
                        </p>


                        <small>
                            Today • ${data.city || selectedCity}
                        </small>

                    </div>

                </div>

            `;


            container.insertAdjacentHTML(
                "beforeend",
                alertHTML
            );

        });


        /* =================================================
           UPDATE ALL-CLEAR MESSAGE
           ================================================= */

        const allClear =
            document.querySelector(".all-clear");


        if (allClear) {

            /*
             * A real alert exists, so the
             * "No other major alerts" message
             * should not be shown.
             */

            allClear.style.display = "none";

        }


        console.log(
            "Alerts loaded successfully for:",
            data.city || selectedCity
        );

    }


    /* =====================================================
       ERROR HANDLING
       ===================================================== */

    catch (error) {

        console.error(
            "Alerts loading error:",
            error
        );


        container.innerHTML = `

            <div
                class="alert-card caution"
            >

                <div class="alert-icon">
                    ⚠️
                </div>


                <div class="alert-content">

                    <div class="alert-heading">

                        <h3>
                            Unable to load alerts
                        </h3>

                    </div>


                    <p>
                        We could not retrieve weather
                        alerts for ${selectedCity}.
                        Please try again.
                    </p>

                </div>

            </div>

        `;


        /* Hide the static all-clear message */

        const allClear =
            document.querySelector(".all-clear");


        if (allClear) {

            allClear.style.display = "none";

        }

    }

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

/*
 * Read the city selected on the Home page.
 *
 * If no city has been selected yet,
 * Kolkata will be used.
 */

const savedCity =
    localStorage.getItem("selectedCity") ||
    "Kolkata";


console.log(
    "Alerts page city:",
    savedCity
);


loadAlerts(savedCity);