export default class MatchManager {
  constructor(
    storageRepository,
    htmlManager,
    buttonManager,
    llmProviderManager
  ) {
    this._storageRepository = storageRepository;
    this._HtmlManager = htmlManager;
    this._ButtonManager = buttonManager;
    this._LlmProviderManager = llmProviderManager;
  }

  async controleInAnonymiserMode(llm) {
    const state = await this._storageRepository.getState();
    console.log(state);
    if (state == 0) return;

    let text = llm.prompt.innerHTML;

    if (text === "") {
      text = llm.prompt.value;
    }

    const words = await this._storageRepository.getWords();
    const anonymisedWords = await this._storageRepository.getAnonymisedWords();
    const isMatch = this._checkPrompt(words, text);

    if (!llm.button.element.isConnected) {
      llm = await this._LlmProviderManager.reload();
    }
    if (!isMatch) {
      this._ButtonManager.unlock(llm.button);
      this._HtmlManager.unlockEnterKey();
      return;
    }
    this._HtmlManager.anonymise(llm, anonymisedWords.anonymised);
  }

  async controleInWatchMode(llm) {
    const state = await this._storageRepository.getState();
    if (state == 0) return;

    let text = llm.prompt.innerHTML;

    if (text === "") {
      text = llm.prompt.value;
    }

    const words = await this._storageRepository.getWords();
    const isMatch = this._checkPrompt(words, text);
    this._HtmlManager.updateMirrorText(llm.prompt);

    if (!llm.button.element.isConnected) {
      llm = await this._LlmProviderManager.reload();
    }
    if (!isMatch) {
      this._ButtonManager.unlock(llm.button);
      this._HtmlManager.unlockEnterKey();
      return;
    }
    this._ButtonManager.lock(llm.button);
    this._HtmlManager.lockEnterKey();
    this._HtmlManager.highlightWord(words, text);
  }

  _checkPrompt(dictionnary, inputPrompt) {
    return dictionnary.some((word) => {
      const regex = new RegExp("\\b" + word + "\\b", "i");
      return regex.test(inputPrompt);
    });
  }
}
