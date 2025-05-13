export default class ModeManager {
  constructor(listenerManager, storageRepository) {
    this._listenerManager = listenerManager;
    this._storageRepository = storageRepository;
  }

  async initialize() {
    const isAnonymisedMode = this._storageRepository.getMode();

    if (!isAnonymisedMode) await this._listenerManager.startWatchMode();
    await this._listenerManager.startAnonymisedMode();
  }
}
