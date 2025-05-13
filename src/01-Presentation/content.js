//Import Services

import ModeService from "../03-Application/Services/ModeService.js";

//Import Managers

import LlmRepository from "../02-Infrastructure/Repository/LlmRepository.js";
import MatchManager from "../03-Application/Managers/MatchManager.js";
import StorageRepository from "../02-Infrastructure/Repository/StorageRepository.js";
import HtmlManager from "../03-Application/Managers/HtmlManager.js";
import LlmProviderManager from "../03-Application/Managers/LlmProviderManager.js";
import ListenerManager from "../03-Application/Managers/ListenerManager.js";
import ButtonManager from "../03-Application/Managers/ButtonManager.js";
import ModeManager from "../03-Application/Managers/ModeManager.js";

//Init Dependency
const llmRepository = new LlmRepository();
const storageRepository = new StorageRepository();
const htmlManager = new HtmlManager(llmRepository);
const llmProviderManager = new LlmProviderManager(llmRepository);
const buttonManager = new ButtonManager();
const matchManager = new MatchManager(
  storageRepository,
  htmlManager,
  buttonManager,
  llmProviderManager
);
const listenerManager = new ListenerManager(
  htmlManager,
  llmProviderManager,
  matchManager
);
const modeManager = new ModeManager(listenerManager, storageRepository);

const modeService = new ModeService(modeManager);

//Start
modeService.initialize();

let lastUrl = window.location.href;

setInterval(() => {
  const currentUrl = window.location.href;

  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    listenerService.listen();
  }
}, 500);
