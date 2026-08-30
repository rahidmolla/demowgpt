const storedUser = JSON.parse(
    localStorage.getItem("weatherGPTUser")
);

if (!storedUser) {

    window.location.href = "auth.html";

} else {

    document.getElementById("profileName").textContent =
        storedUser.name;

    document.getElementById("profileEmail").textContent =
        storedUser.email;

    document.getElementById("preferredCity").value =
        storedUser.preferredCity || "";

}


const saveProfileBtn =
    document.getElementById("saveProfileBtn");


saveProfileBtn.addEventListener("click", () => {

    const preferredCity =
        document.getElementById("preferredCity").value.trim();


    if (preferredCity === "") {

        document.getElementById("profileMessage").textContent =
            "Please enter a city.";

        return;
    }


    storedUser.preferredCity =
        preferredCity;


    localStorage.setItem(
        "weatherGPTUser",
        JSON.stringify(storedUser)
    );


    document.getElementById("profileMessage").textContent =
        "Preferences saved successfully!";

});


function goHome() {

    window.location.href = "home.html";

}


function goForecast() {

    window.location.href = "forecast.html";

}


function goAlerts() {

    window.location.href = "alerts.html";

}


function logout() {

    localStorage.removeItem(
        "weatherGPTLoggedIn"
    );

    window.location.href = "index.html";

}