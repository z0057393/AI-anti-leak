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

  async waitForPrompt(timeout = 10000, intervalTime = 300) {
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const prompt = this.getPrompt();

        if (prompt instanceof Node) {
          clearInterval(interval);
          resolve(prompt);
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(new Error("Prompt introuvable après timeout"));
        }
      }, intervalTime);
    });
  }
}
