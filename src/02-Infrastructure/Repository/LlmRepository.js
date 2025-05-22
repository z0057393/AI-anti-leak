import ILlmRepository from "../../03-Application/Interface/ILlmRepository";
import ChatGPTManager from "../Managers/chatGPTManager";
import MistralManager from "../Managers/MistralManager";
import deepseekManager from "../Managers/deepseekManager";
import geminiManager from "../Managers/geminiManager";

export default class LlmRepository extends ILlmRepository {
  constructor() {
    super();
  }

  getButton() {
    switch (true) {
      case this._urlContains("chatgpt"):
        return new ChatGPTManager().getButton();
      case this._urlContains("mistral"):
        return new MistralManager().getButton();
      case this._urlContains("deepseek"):
        return new deepseekManager().getButton();
      case this._urlContains("gemini"):
        return new geminiManager().getButton();
      default:
        throw new Error("IA non géré");
    }
  }

  async tryGetPrompt(timeout = 10000, intervalTime = 300) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const prompt = this._getPrompt();
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

  _urlContains(llmName) {
    const regex = new RegExp("\\b" + llmName + "\\b", "i");
    return regex.test(this._getUrl());
  }

  _getUrl() {
    return window.location.href;
  }

  _getPrompt() {
    switch (true) {
      case this._urlContains("chatgpt"):
        return new ChatGPTManager().getPrompt();
      case this._urlContains("mistral"):
        return new MistralManager().getPrompt();
      case this._urlContains("deepseek"):
        return new deepseekManager().getPrompt();
      case this._urlContains("gemini"):
        return new geminiManager().getPrompt();
      default:
        throw new Error("IA non géré");
    }
  }
}
