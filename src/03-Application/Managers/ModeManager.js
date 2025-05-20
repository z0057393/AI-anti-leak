export default class ModeManager {
  constructor(listenerManager, storageRepository) {
    this._listenerManager = listenerManager;
    this._storageRepository = storageRepository;
  }

  async initialize() {
    let lastMode = await this._storageRepository.getMode();

    const init = async () => {
      const isAnonymisedMode = await this._storageRepository.getMode();

      if (isAnonymisedMode) {
        await this._listenerManager.startAnonymisedMode();
      } else {
        await this._listenerManager.startWatchMode();
      }
    };

    await init();

    setInterval(async () => {
      const currentMode = await this._storageRepository.getMode();
      if (currentMode != lastMode) {
        lastMode = currentMode;
        await init();
      }
    }, 1000);
  }
}
