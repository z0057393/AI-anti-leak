export default class ListenerService {
  constructor(ListenerManager) {
    this._ListenerManager = ListenerManager;
  }

  listen() {
    this._ListenerManager.listen();
  }
}
