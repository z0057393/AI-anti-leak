import aiFactory from "../02-Infrastructure/Factory/AIFactory";

export default class HtmlManager {
  constructor() {
    this.aiFactory = new aiFactory();
  }

  getPrompt() {
    return this.aiFactory.getPrompt();
  }

  getButton() {
    return this.aiFactory.getButton();
  }

  lockButton() {
    this.aiFactory.lockButton();
  }

  unlockButton() {
    this.aiFactory.unlockButton();
  }
}
