import browser from "webextension-polyfill";

export default class WordsManager {
  constructor() {
    this.words = [];
  }

  async getWords() {
    const result = await browser.storage.local.get("motsInterdits");
    this.words = result.motsInterdits || [];
    return this.words;
  }
}
