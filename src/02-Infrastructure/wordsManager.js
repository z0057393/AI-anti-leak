import browser from "webextension-polyfill";

export default class WordsManager {
  constructor() {
    this.words = [];
    this.listenToStorageChanges();
  }

  async getWords() {
    const result = await browser.storage.local.get("motsInterdits");
    this.words = result.motsInterdits || [];
    return this.words;
  }
  listenToStorageChanges() {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.motsInterdits) {
        const newWords = changes.motsInterdits.newValue || [];
        this.words = newWords;
      }
    });
  }
}
