import ChatGPTManager from "../chatGPTManager";

export default class aiFactory {
  constructor() {}

  getUrl() {
    return window.location.href;
  }

  urlContains(aiName) {
    const regex = new RegExp("\\b" + aiName + "\\b", "i");
    return regex.test(this.getUrl());
  }

  getPrompt() {
    switch (true) {
      case this.urlContains("chatgpt"):
        return new ChatGPTManager().getPrompt();
      default:
        throw new Error("IA non géré");
    }
  }

  getButton() {
    switch (true) {
      case this.urlContains("chatgpt"):
        return new ChatGPTManager().getButton();
      default:
        throw new Error("IA non géré");
    }
  }

  lockButton() {
    switch (true) {
      case this.urlContains("chatgpt"):
        new ChatGPTManager().lockButton();
        return;
      default:
        throw new Error("IA non géré");
    }
  }

  unlockButton() {
    switch (true) {
      case this.urlContains("chatgpt"):
        new ChatGPTManager().unlockButton();
        return;
      default:
        throw new Error("IA non géré");
    }
  }
}
