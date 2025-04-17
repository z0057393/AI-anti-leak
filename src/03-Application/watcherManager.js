import HtmlManager from "./HtmlManager";
import WordsManager from "../02-Infrastructure/wordsManager";
import RegexManager from "../04-Domain/regexManager";

export default class WatcherManager {
  constructor() {
    this.wordsManager = new WordsManager();
    this.htmlManager = new HtmlManager();
    this.regexManager = new RegexManager();
  }

  async start() {
    const prompt = await this.getPrompt();

    if (prompt) {
      const observerCallback = this.initObserver();
      const observer = new MutationObserver(observerCallback);

      observer.observe(prompt, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      console.log("Observation des changements du prompt démarrée !");
    } else {
      console.log("Aucun prompt trouvé");
    }
  }

  async getPrompt() {
    return await this.htmlManager.waitForPrompt();
  }

  getSendButton() {
    return this.htmlManager.getButton();
  }
  async getWords() {
    return await this.wordsManager.getWords();
  }

  initObserver() {
    return (mutations) => {
      mutations.forEach(async (mutation) => {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          const dictionnary = await this.wordsManager.getWords();
          this.checkMutation(mutation, dictionnary);
        }
      });
    };
  }

  checkMutation(mutation, dictionnary) {
    const isMatch = this.regexManager.CheckPrompt(
      dictionnary,
      this.getTextMutation(mutation)
    );

    if (this.getSendButton()) {
      this.lockOrUnlockSendButton(isMatch);
    } else {
      console.log("Élément introuvable.");
    }
  }

  getTextMutation(mutation) {
    return mutation.target.textContent;
  }

  lockOrUnlockSendButton(isMatch) {
    if (isMatch) {
      this.htmlManager.lockButton();
    } else {
      this.htmlManager.unlockButton();
    }
  }
}
