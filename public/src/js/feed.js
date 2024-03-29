const shareImageButton = document.querySelector("#share-image-button");
const createPostArea = document.querySelector("#create-post");
const closeCreatePostModalButton = document.querySelector(
  "#close-create-post-modal-btn"
);
const sharedMomentsArea = document.querySelector("#shared-moments");

const openCreatePostModal = () => {
  createPostArea.style.display = "block";
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === "dismissed") {
        console.log("User cancelled installation");
      } else {
        console.log("User added to home screen");
      }
    });

    deferredPrompt = null;
  }
};

const closeCreatePostModal = () => {
  createPostArea.style.display = "none";
};

shareImageButton.addEventListener("click", openCreatePostModal);

closeCreatePostModalButton.addEventListener("click", closeCreatePostModal);

//Currently not in use, allows to save assets in cache on demand otherwise
const onSaveButtonClicked = (event) => {
  console.log("clicked");
  if ("caches" in window) {
    caches.open("user-requested").then((cache) => {
      cache.add("https://httpbin.org/get");
      cache.add("/src/images/sf-boat.jpg");
    });
  }
};

const createCard = () => {
  const cardWrapper = document.createElement("div");
  cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp";

  const cardTitle = document.createElement("div");
  cardTitle.className = "mdl-card__title";
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
  cardTitle.style.backgroundSize = "cover";
  cardTitle.style.height = "180px";

  cardWrapper.appendChild(cardTitle);

  const cardTitleTextElement = document.createElement("h2");

  cardTitleTextElement.style.color = "white";
  cardTitleTextElement.className = "mdl-card__title-text";
  cardTitleTextElement.textContent = "San Francisco Trip";
  cardTitle.appendChild(cardTitleTextElement);

  const cardSupportingText = document.createElement("div");
  cardSupportingText.className = "mdl-card__supporting-text";
  cardSupportingText.textContent = "In San Francisco";
  cardSupportingText.style.textAlign = "center";

  // const cardSaveButton = document.createElement("button");
  // cardSaveButton.textContent = "Save";
  // cardSaveButton.addEventListener("click", onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);

  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
};

let networkDataReceived = false;

const clearCards = () => {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
};

const getMatchedCache = async () => {
  const response = await caches.match("https://httpbin.org/get");
  // const data = await response.json();
  console.log("From cache data");

  clearCards();
  createCard();
};

if ("caches" in window) {
  getMatchedCache();
}

(async () => {
  // const response = await fetch("https://httpbin.org/get");
  // const data = await response.json();

  await fetch("https://httpbin.org/get");

  networkDataReceived = true;

  clearCards();
  createCard();

  console.log("From web data");
})();

// fetch("https://httpbin.org/get")
//   .then((res) => {
//     return res.json();
//   })
//   .then((data) => {
//     createCard();
//   });
