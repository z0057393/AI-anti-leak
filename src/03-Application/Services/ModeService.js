export default class ModeService {
  constructor(modeManager) {
    this._modeManager = modeManager;
  }

  initialize() {
    this._modeManager.initialize();
  }
}
