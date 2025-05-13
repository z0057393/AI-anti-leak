export default class ListenerManager {
  constructor(htmlManager, llmProviderManager, matchManager) {
    this._HtmlManager = htmlManager;
    this._LlmProviderManager = llmProviderManager;
    this._MatchManager = matchManager;
    this.lastContentFound = "";
  }

  async startWatchMode() {
    const llm = await this._LlmProviderManager.Get();
    this._HtmlManager.validate(llm);
    this._HtmlManager.createMirrorDiv(llm.prompt);
    this._initWatchListerners(llm);
  }

  async startAnonymisedMode() {
    const llm = await this._LlmProviderManager.Get();
    this._HtmlManager.validate(llm);
    this._initAnonymiserListerners(llm);
  }

  _initWatchListerners(llm) {
    llm.prompt.addEventListener("keydown", () =>
      this._MatchManager.controleInWatchMode(llm)
    );
  }

  _initAnonymiserListerners(llm) {
    llm.prompt.addEventListener("keydown", () =>
      this._MatchManager.controleInAnonymiserMode(llm)
    );
  }
}
