export default class ListenerManager {
  constructor(htmlManager, llmProviderManager, matchManager) {
    this._HtmlManager = htmlManager;
    this._LlmProviderManager = llmProviderManager;
    this._MatchManager = matchManager;
    this._onPromptKeydown;
  }

  async startAnonymisedMode() {
    const llm = await this._LlmProviderManager.Get();

    this._cleanupPreviousListeners(llm);
    this._HtmlManager.validate(llm);
    this._initAnonymiserListerners(llm);
  }

  _initAnonymiserListerners(llm) {
    this._onPromptKeydown = (event) => {
      this._MatchManager.controleInAnonymiserMode(llm, event.key);
    };

    llm.prompt.addEventListener("keydown", this._onPromptKeydown);
  }

  _cleanupPreviousListeners(llm) {
    if (this._onPromptKeydown) {
      llm.prompt.removeEventListener("keydown", this._onPromptKeydown);
      this._onPromptKeydown = null;
    }
  }
}
