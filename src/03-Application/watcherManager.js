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

      prompt.addEventListener("input", (event) => this.eventDetected(event));
      prompt.addEventListener("paste", (event) => this.eventDetected(event), 0);

      console.log("Observation des changements du prompt démarrée !");
    } else {
      console.log("Aucun prompt trouvé");
    }
  }

  async eventDetected(prompt) {
    const dictionnary = await this.wordsManager.getWords();
    this.checkEvent(prompt, dictionnary);
  }

  checkEvent(prompt, dictionnary) {
    const content = prompt.target.innerHTML;
    const isMatch = this.regexManager.CheckPrompt(dictionnary, content);

    if (isMatch) {
      if (this.lastContentFound != content) {
        this.htmlManager.lockEnterKey();
        this.htmlManager.highlightWord(dictionnary, content);
        const btn = this.getSendButton();
        if (btn) {
          this.lockOrUnlockSendButton(isMatch);
        }
        this.lastContentFound = content;
      }
    } else {
      this.htmlManager.unlockEnterKey();
      this.htmlManager.updateMirrorText(content);
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

  lockOrUnlockSendButton(isMatch) {
    if (isMatch) {
      this.htmlManager.lockButton();
    } else {
      this.htmlManager.unlockButton();
    }
  }
}
