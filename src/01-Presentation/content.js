import LlmRepository from "../02-Infrastructure/Repository/LlmRepository.js";
import LlmProviderManager from "../03-Application/Managers/LlmProviderManager.js";
import ListenerManager from "../03-Application/Managers/ListenerManager.js";
import ListenerService from "../03-Application/Services/ListenerService.js";
import ApiRepository from "../02-Infrastructure/Repository/ApiRepository.js";

//Init Dependency

const apiRepository = new ApiRepository();
const llmRepository = new LlmRepository();
const llmProviderManager = new LlmProviderManager(llmRepository);

const listenerManager = new ListenerManager(llmProviderManager, apiRepository);

const listenerService = new ListenerService(listenerManager);

/* Main */
function startObserving() {
  const parent = document.body;
  if (!parent) {
    setTimeout(startObserving, 50);
    return;
  }

  const observerCallback = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const elem = document.querySelector("#composer-submit-button");
        if (elem) {
          listenerService.listenButton();
        }
      }
    }
  };

  const observer = new MutationObserver(observerCallback);

  observer.observe(parent, { childList: true, subtree: true });
}

if (document.body) {
  startObserving();
} else {
  window.addEventListener("DOMContentLoaded", startObserving);
}
