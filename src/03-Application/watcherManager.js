import HtmlManager from "./HtmlManager";
import WordsManager from "../02-Infrastructure/wordsManager";
import RegexManager from "../04-Domain/regexManager";

export default class WatcherManager {
  constructor() {
    this.wordsManager = new WordsManager();
    this.htmlManager = new HtmlManager();
    this.regexManager = new RegexManager();
    this.lastContentFound = "";
  }

  async start() {
    const prompt = await this.getPrompt();

    if (prompt) {
      this.htmlManager.createMirrorDiv(prompt);
      const observerCallback = this.initObserver();
      const observer = new MutationObserver((mutations) => {
        if (this.htmlManager.isUpdating) return;
        observerCallback(mutations); // tableau, pas mutation seule
        console.log(this.htmlManager.isUpdating);
      });

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
    const content = this.getTextMutation(mutation);
    if (!content?.trim()) return;
    const isMatch = this.regexManager.CheckPrompt(dictionnary, content);
    if (isMatch) {
      if (this.lastContentFound != content) {
        this.htmlManager.lockEnterKey();

        const targetNode =
          mutation.target.nodeType === Node.TEXT_NODE
            ? mutation.target.parentElement
            : mutation.target;

        this.htmlManager.highlightWord(dictionnary, targetNode);

        const btn = this.getSendButton();
        if (btn) {
          this.lockOrUnlockSendButton(isMatch);
        }
        this.lastContentFound = content;
      }
    } else {
      this.htmlManager.unlockEnterKey();
      this.htmlManager.updateMirrorText(mutation.target.textContent);
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
