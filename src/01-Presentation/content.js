import WatcherManager from "../03-Application/watcherManager.js";

const watcher = new WatcherManager();
watcher.start();

let lastUrl = window.location.href;

setInterval(() => {
  const currentUrl = window.location.href;

  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    watcher.start();
  }
}, 500);
