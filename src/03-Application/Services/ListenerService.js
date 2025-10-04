export default class ListenerService {
  constructor(listenerManager) {
    this._listenerManager = listenerManager;
  }

  async listenButton() {
    this._listenerManager.listenButton();
  }
}
