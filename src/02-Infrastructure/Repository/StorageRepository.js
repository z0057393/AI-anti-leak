import browser from "webextension-polyfill";
import IStorageRepository from "../../03-Application/Interface/IStorageRepository";

export default class StorageRepository extends IStorageRepository {
  constructor() {
    super();
    this.words = [];
    this.anonymisedWords = null;
    this.listenToStorageChanges();
  }

  // Écoute les changements dans le localStorage
  listenToStorageChanges() {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === "local") {
        // Vérifier les changements spécifiques et mettre à jour les propriétés de la classe
        if (changes.motsInterdits) {
          this.words = changes.motsInterdits.newValue || [];
        }

        if (changes["AIAL-AnonymisedWords"]) {
          this.anonymisedWords =
            changes["AIAL-AnonymisedWords"].newValue || null;
        }
      }
    });
  }

  // Récupère les mots anonymisés
  async getAnonymisedWords() {
    const result = await browser.storage.local.get("AIAL-AnonymisedWords");
    this.anonymisedWords = result["AIAL-AnonymisedWords"] || {};
    return this.anonymisedWords;
  }

  // Récupère la liste des mots interdits
  async getWords() {
    const result = await browser.storage.local.get("motsInterdits");
    this.words = result.motsInterdits || [];
    return this.words;
  }
}
