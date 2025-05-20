export default class ListenerManager {
  constructor(htmlManager, llmProviderManager, matchManager) {
    this._HtmlManager = htmlManager;
    this._LlmProviderManager = llmProviderManager;
    this._MatchManager = matchManager;
    this.lastContentFound = "";
    this._onPromptKeydown;
  }

  async startWatchMode() {
    const llm = await this._LlmProviderManager.Get();

    this._beforeModeSwitch(llm);
    this._HtmlManager.validate(llm);
    this._HtmlManager.createMirrorDiv(llm.prompt);
    this._initWatchListerners(llm);
  }

  async startAnonymisedMode() {
    const llm = await this._LlmProviderManager.Get();

    this._beforeModeSwitch(llm);
    this._HtmlManager.validate(llm);
    this._initAnonymiserListerners(llm);
  }

  _initWatchListerners(llm) {
    this._onPromptKeydown = () => {
      this._MatchManager.controleInWatchMode(llm);
    };

    llm.prompt.addEventListener("keydown", this._onPromptKeydown);
  }

  _initAnonymiserListerners(llm) {
    this._onPromptKeydown = () => {
      this._MatchManager.controleInAnonymiserMode(llm);
    };

    llm.prompt.addEventListener("keydown", this._onPromptKeydown);
  }

  _beforeModeSwitch(llm) {
    if (this._onPromptKeydown) {
      llm.prompt.removeEventListener("keydown", this._onPromptKeydown);

      this._onPromptKeydown = null;
    }

    this._HtmlManager.removeMirrorDiv();
  }
}
