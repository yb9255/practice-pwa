const CACHE_STATIC_NAME = "static-v13";
const CACHE_DYNAMIC_NAME = "dynamic-v2";
const STATIC_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/src/js/app.js",
  "/src/js/feed.js",
  "/src/js/promise.js",
  "/src/js/fetch.js",
  "/src/js/material.min.js",
  "/src/css/app.css",
  "/src/css/feed.css",
  "/src/images/main-image.jpg",
  "https://fonts.googleapis.com/css?family=Roboto:400,700",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker ...", event);
  event.waitUntil(
    (async () => {
      const cacheStorage = await caches.open(CACHE_STATIC_NAME);

      console.log("[Service Worker] Precaching App Shell");

      cacheStorage.addAll(STATIC_FILES);
    })()
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker ....", event);

  event.waitUntil(
    (async () => {
      const keyList = await caches.keys();

      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log("[Service Worker] Removing old cache.", key);
            return caches.delete(key);
          }
        })
      );
    })()
  );

  return self.clients.claim();
});

// Cache then Network strategy
self.addEventListener("fetch", (event) => {
  const url = "https://httpbin.org/get";

  if (event.request.url.includes(url)) {
    event.respondWith(
      (async () => {
        const cacheStorage = await caches.open(CACHE_DYNAMIC_NAME);
        const response = await fetch(event.request);

        await cacheStorage.put(event.request, response.clone());

        return response;
      })()
    );
  } else if (
    STATIC_FILES.some((filePath) => filePath.includes(event.request.url))
  ) {
    event.respondWith(caches.match(event.request));
  } else {
    event.respondWith(
      (async () => {
        try {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) return cachedResponse;

          const response = await fetch(event.request);
          const cacheStorage = await caches.open(CACHE_DYNAMIC_NAME);

          await cacheStorage.put(event.request.url, response.clone());

          return response;
        } catch {
          const cacheStorage = await caches.open(CACHE_STATIC_NAME);

          if (event.request.headers.get("accept").includes("text/html")) {
            return cacheStorage.match("/offline.html");
          }
        }
      })()
    );
  }
});

// Cache-only strategy
// self.addEventListener("fetch", function (event) {
//   event.respondWith(caches.match(event.request));
// });

// Network-only strategy
// self.addEventListener("fetch", function (event) {
//   event.respondWith(fetch(event.request));
// });

// Network with Cache Fallback strategy
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(async (res) => {
//         return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//           cache.put(event.request.url, res.clone());
//           return res;
//         });
//       })
//       .catch(() => {
//         return caches.match(event.request);
//       })
//   );
// });
