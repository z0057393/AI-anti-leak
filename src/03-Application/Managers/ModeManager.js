export default class ModeManager {
  constructor(listenerManager) {
    this._listenerManager = listenerManager;
  }

  async initialize() {
    await this._listenerManager.startAnonymisedMode();
  }
}
