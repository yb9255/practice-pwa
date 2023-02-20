let deferredPrompt;

if (!window.Promise) {
  window.Promise = Promise;
}

if ("serviceWorker" in navigator) {
  async function registorServiceWorker() {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker registered!");
    } catch (error) {
      console.log(err);
    }
  }
}

window.addEventListener("beforeinstallprompt", function (event) {
  console.log("beforeinstallprompt fired");
  event.preventDefault();

  deferredPrompt = event;

  return false;
});
