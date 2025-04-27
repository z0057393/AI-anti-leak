export default class MatchManager {
  constructor(wordsManager, htmlManager, buttonManager, llmProviderManager) {
    this._WordsManager = wordsManager;
    this._HtmlManager = htmlManager;
    this._ButtonManager = buttonManager;
    this._LlmProviderManager = llmProviderManager;
  }

  async controle(llm) {
    const words = await this._WordsManager.getWords();
    const isMatch = this._checkPrompt(words, llm.prompt.innerHTML);
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
    this._HtmlManager.highlightWord(words, llm.prompt.innerHTML);
  }

  _checkPrompt(dictionnary, inputPrompt) {
    return dictionnary.some((word) => {
      const regex = new RegExp("\\b" + word + "\\b", "i");
      return regex.test(inputPrompt);
    });
  }
}
