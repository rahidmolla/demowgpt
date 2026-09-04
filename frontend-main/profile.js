/* =========================================================
   WEATHERGPT - PROFILE PAGE
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


function goAlerts() {
    window.location.href = "alerts.html";
}


/* =========================================================
   CHECK LOGIN
   ========================================================= */

const loggedIn =
    localStorage.getItem("weatherGPTLoggedIn");

const savedUser =
    localStorage.getItem("weatherGPTUser");


/*
 * If the user is not logged in,
 * send them to the actual login page.
 *
 * Your login page is index.html,
 * not auth.html.
 */

if (
    loggedIn !== "true" ||
    !savedUser
) {
    window.location.href = "index.html";
}


/* =========================================================
   LOAD USER DATA
   ========================================================= */

let user = null;

try {

    user = JSON.parse(savedUser);

} catch (error) {

    console.error(
        "Unable to read saved user data:",
        error
    );

}


/* =========================================================
   DISPLAY USER INFORMATION
   ========================================================= */

if (user) {

    const nameElement =
        document.getElementById("profileName");

    const emailElement =
        document.getElementById("profileEmail");


    if (nameElement) {

        nameElement.textContent =
            user.name || "WeatherGPT User";

    }


    if (emailElement) {

        emailElement.textContent =
            user.email || "";

    }

}


/* =========================================================
   LOAD PREFERRED / SELECTED CITY
   ========================================================= */

const selectedCity =
    localStorage.getItem("selectedCity") ||
    "Kolkata";


const cityElement =
    document.getElementById("preferredCity");


if (cityElement) {

    cityElement.textContent =
        selectedCity;

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    /*
     * Remove login session.
     *
     * Keep selectedCity and user information
     * untouched so the app can remember
     * the user's preference.
     */

    localStorage.removeItem(
        "weatherGPTLoggedIn"
    );


    window.location.href =
        "index.html";
}