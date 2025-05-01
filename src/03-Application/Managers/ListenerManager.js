export default class ListenerManager {
  constructor(htmlManager, llmProviderManager, matchManager) {
    this._HtmlManager = htmlManager;
    this._LlmProviderManager = llmProviderManager;
    this._MatchManager = matchManager;
    this.lastContentFound = "";
  }

  async listen() {
    const llm = await this._LlmProviderManager.Get();
    this._HtmlManager.validate(llm);
    this._HtmlManager.createMirrorDiv(llm.prompt);
    this._initListerners(llm);
  }

  _initListerners(llm) {
    llm.prompt.addEventListener("keydown", () =>
      this._MatchManager.controle(llm)
    );
  }
}
