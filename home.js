const sendBtn =
    document.getElementById("sendBtn");

const messageInput =
    document.getElementById("messageInput");

const chatBox =
    document.getElementById("chatBox");

const micBtn =
    document.getElementById("micBtn");

    const storedUser = JSON.parse(
    localStorage.getItem("weatherGPTUser")
);

if (storedUser && storedUser.preferredCity) {

    localStorage.setItem("selectedCity",
        storedUser.preferredCity
    );
}


/* SEND MESSAGE */

function sendMessage() {

    const message =
        messageInput.value.trim();

    if (message === "") {
        return;
    }

    addUserMessage(message);

    messageInput.value = "";

    setTimeout(() => {

        generateWeatherResponse(message);

    }, 700);
}


sendBtn.addEventListener(
    "click",
    sendMessage
);


messageInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            sendMessage();
        }

    }
);


/* USER MESSAGE */

function addUserMessage(message) {

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message user-message";

    messageDiv.innerHTML = `

        <div class="message-content">
            ${escapeHTML(message)}
        </div>

    `;

    chatBox.appendChild(messageDiv);

    scrollChat();
}


/* AI WEATHER RESPONSE */

async function generateWeatherResponse(question) {

    let city = question;

    const match =
        question.match(
            /(?:weather\s+(?:in\s+)?|in\s+)([a-zA-Z\s]+)/i
        );

    if (match) {

        city = match[1].trim();

    }

    try {

        const response = await fetch(
            "https://demowgpt.onrender.com/api/weather/",
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


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail
            );

        }


        const message = `
Weather in ${data.data.city}, ${data.data.country}:

🌡️ Temperature: ${data.data.temperature}°C
🤔 Feels like: ${data.data.feels_like}°C
💧 Humidity: ${data.data.humidity}%
💨 Wind speed: ${data.data.wind_speed} km/h
☁️ Condition: ${data.data.description}
        `;


        addBotMessage(message);

    } catch (error) {

        addBotMessage(
            "Sorry, I could not retrieve the weather data."
        );

        console.error(error);

    }

}


/* BOT MESSAGE */

function addBotMessage(message) {

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message bot-message";

    messageDiv.innerHTML = `

        <div class="avatar">
            🤖
        </div>

        <div class="message-content">
            ${escapeHTML(message)}
        </div>

    `;

    chatBox.appendChild(messageDiv);

    scrollChat();

}


/* SCROLL CHAT */

function scrollChat() {

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


/* SECURITY */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* VOICE INPUT */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    micBtn.addEventListener(
        "click",
        () => {

            recognition.start();

            micBtn.textContent = "🔴";

        }
    );


    recognition.onresult =
        (event) => {

            const transcript =
                event.results[0][0].transcript;

            messageInput.value =
                transcript;

            micBtn.textContent =
                "🎤";

        };


    recognition.onerror =
        () => {

            micBtn.textContent =
                "🎤";

        };


    recognition.onend =
        () => {

            micBtn.textContent =
                "🎤";

        };

} else {

    micBtn.addEventListener(
        "click",
        () => {

            alert(
                "Voice input is not supported in this browser."
            );

        }
    );

}


/* NAVIGATION */

function openForecast() {

    window.location.href =
        "forecast.html";

}


function openAlerts() {

    window.location.href =
        "alerts.html";

}


/* LOGOUT */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "weatherGPTLoggedIn"
            );

            window.location.href =
                "index.html";

        }
    );


/* LOAD REAL WEATHER */


    async function loadWeather(city) {

    if (!city) {

        const storedUser = JSON.parse(
            localStorage.getItem("weatherGPTUser")
        );

        city =
            localStorage.getItem("selectedCity") ||
            (storedUser && storedUser.preferredCity
                ? storedUser.preferredCity
                : "Kolkata");
    }

    try {

        const response = await fetch(
            "https://demowgpt.onrender.com/api/weather/",
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
                result.detail
            );

        }


        const data =
            result.data;


        /* SAVE SELECTED CITY */

        localStorage.setItem(
            "selectedCity",
            data.city
        );


        /* UPDATE HOME PAGE */

        document
            .getElementById("cityName")
            .textContent =
            data.city;


        document
            .getElementById("temperature")
            .textContent =
            data.temperature;


        document
            .getElementById("feelsLike")
            .textContent =
            `Feels like ${data.feels_like}°C`;


        document
            .getElementById("humidity")
            .textContent =
            `${data.humidity}%`;


        document
            .getElementById("windSpeed")
            .textContent =
            `${data.wind_speed} km/h`;


        document
            .getElementById("weather-condition")
            .textContent =
            data.description;


    } catch (error) {

        console.error(
            "Weather loading error:",
            error
        );

    }

}


/* LOAD SAVED CITY WEATHER */

loadWeather();


/* CHANGE LOCATION */

document
    .getElementById("changeLocation")
    .addEventListener(
        "click",
        () => {

            const city = prompt(
                "Enter a city name:"
            );


            if (
                city &&
                city.trim() !== ""
            ) {

                loadWeather(
                    city.trim()
                );

            }

        }
    );

    if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {
                console.log("Service Worker registered successfully!");
            })
            .catch((error) => {
                console.log("Service Worker registration failed:", error);
            });
    });
}

function openProfile() {
    window.location.href = "profile.html";
}