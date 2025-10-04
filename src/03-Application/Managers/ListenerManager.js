export default class ListenerManager {
  constructor(llmProviderManager, apiRepository) {
    this._LlmProviderManager = llmProviderManager;
    this._ApiRepository = apiRepository;
    this._buttonClickListener = null;
  }

  async listenButton() {
    let llm = await this._LlmProviderManager.Get();
    const button = llm.button.element;

    if (!button) return;

    if (!button.dataset.listenerAdded) {
      if (this._buttonClickListener && this._buttonClickListenerButton) {
        this._buttonClickListenerButton.removeEventListener(
          "click",
          this._buttonClickListener
        );
      }

      this._buttonClickListener = () => this._ApiRepository.send(llm);
      this._buttonClickListenerButton = button;
      button.addEventListener("click", this._buttonClickListener);
      button.dataset.listenerAdded = "true";

      console.log("Listener is set");
    }
  }
}
