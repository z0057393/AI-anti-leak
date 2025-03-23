import HtmlManager from "../02-Infrastructure/HtmlManager";
import WordsManager from "../02-Infrastructure/wordsManager";
import RegexManager from "../04-Domain/regexManager";

export default class WatcherManager {
  constructor() {
    this.wordsManager = new WordsManager();
    this.htmlManager = new HtmlManager();
    this.regexManager = new RegexManager();
  }

  start() {
    const prompt = this.getPrompt();
    const dictionnary = this.getWords();

    if (prompt) {
      const observerCallback = this.initObserver(dictionnary);
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

  getPrompt() {
    return this.htmlManager.getPrompt();
  }

  getSendButton() {
    return this.htmlManager.getButton();
  }
  getWords() {
    return this.wordsManager.getWords();
  }

  initObserver(dictionnary) {
    return (mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
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
