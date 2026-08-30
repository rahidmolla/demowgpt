const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

});


signupTab.addEventListener("click", () => {

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

});


signupForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
        document.getElementById("signupName").value;

    const email =
        document.getElementById("signupEmail").value;

    const password =
        document.getElementById("signupPassword").value;

    const user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem(
        "weatherGPTUser",
        JSON.stringify(user)
    );

    document.getElementById("signupMessage").textContent =
        "Account created successfully!";

    setTimeout(() => {
        loginTab.click();
    }, 1000);

});


loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    const storedUser =
        JSON.parse(
            localStorage.getItem("weatherGPTUser")
        );

    if (
        storedUser &&
        storedUser.email === email &&
        storedUser.password === password
    ) {

        localStorage.setItem(
            "weatherGPTLoggedIn",
            "true"
        );

        window.location.href = "home.html";

    } else {

        document.getElementById("loginMessage").textContent =
            "Invalid email or password.";

    }

});


let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    deferredPrompt = event;

    installBtn.style.display = "block";
});


installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

    installBtn.style.display = "none";
});


window.addEventListener("appinstalled", () => {
    console.log("WeatherGPT installed successfully!");

    installBtn.style.display = "none";
});