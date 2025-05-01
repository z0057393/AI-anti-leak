import browser from "webextension-polyfill";
import IStorageRepository from "../../03-Application/Interface/IStorageRepository";

export default class StorageRepository extends IStorageRepository {
  constructor() {
    super();
    this.words = [];
    this.listenToStorageChanges();
  }
  listenToStorageChanges() {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.motsInterdits) {
        const newWords = changes.motsInterdits.newValue || [];
        this.words = newWords;
      }
    });
  }

  async getState() {
    const result = await browser.storage.local.get("AIAL-State");
    return result["AIAL-State"];
  }

  async getWords() {
    const result = await browser.storage.local.get("motsInterdits");
    this.words = result.motsInterdits || [];
    return this.words;
  }
}
