const CACHE_NAME = "weathergpt-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./home.html",
    "./home.css",
    "./home.js",
    "./auth.css",
    "./auth.js",
    "./forecast.html",
    "./forecast.css",
    "./forecast.js",
    "./alerts.html",
    "./alerts.css",
    "./alerts.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


// Install Service Worker
self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();

});


// Activate Service Worker
self.addEventListener("activate", (event) => {

    event.waitUntil(
        caches.keys().then((keys) => {

            return Promise.all(
                keys.map((key) => {

                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }

                })
            );

        })
    );

    self.clients.claim();

});


// Fetch requests
self.addEventListener("fetch", (event) => {

    const url = new URL(event.request.url);


    // Do NOT cache backend API requests
    if (
        url.hostname === "127.0.0.1" &&
        url.port === "8000"
    ) {
        return;
    }


    // Cache frontend files
    event.respondWith(

        caches.match(event.request).then((response) => {

            return response || fetch(event.request);

        })

    );

});