let deferredPrompt;

if (!window.Promise) {
  window.Promise = Promise;
}

if (navigator.serviceWorker) {
  const registerServiceWorker = async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker registered!");
    } catch (error) {
      console.log(err);
    }
  };

  registerServiceWorker();
}

window.addEventListener("beforeinstallprompt", (event) => {
  console.log("beforeinstallprompt fired");
  event.preventDefault();

  deferredPrompt = event;

  return false;
});
