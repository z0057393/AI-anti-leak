export default class ModeService {
  constructor(modeManager) {
    this._modeManager = modeManager;
    this.lastUrl = window.location.href;
  }

  async initialize() {
    await this._modeManager.initialize();
    this._startUrlMonitoring();
  }

  _startUrlMonitoring() {
    setInterval(() => {
      const currentUrl = window.location.href;
      
      if (currentUrl !== this.lastUrl) {
        this.lastUrl = currentUrl;
        this._modeManager.initialize();
      }
    }, 500);
  }
}
