import LlmProvider from "../../04-Domain/llm";

export default class LlmProviderManager {
  constructor(llmRepository) {
    this._llmRepository = llmRepository;
  }

  async Get() {
    const llmProvider = new LlmProvider();

    llmProvider.prompt = await this._tryGetPrompt();
    llmProvider.button.element = this._getSendButton();

    return llmProvider;
  }

  async reload() {
    const llmProvider = new LlmProvider();

    llmProvider.prompt = await this._tryGetPrompt();
    llmProvider.button.element = this._getSendButton();

    return llmProvider;
  }

  async _tryGetPrompt() {
    return await this._llmRepository.tryGetPrompt();
  }

  _getSendButton() {
    return this._llmRepository.getButton();
  }
}
