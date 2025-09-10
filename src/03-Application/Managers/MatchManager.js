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

  async controleInAnonymiserMode(llm, inputkey) {
    let text = llm.prompt.innerText + inputkey;

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

  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  _checkPrompt(dictionary, inputPrompt) {
    return dictionary.some((word) => {
      const regex = new RegExp(this._escapeRegex(word), "i"); // match partiel, insensible à la casse
      return regex.test(inputPrompt);
    });
  }
}
