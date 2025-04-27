import Bare from "../Bare/Bare";

export default class ChatGPTManager extends Bare {
  constructor() {
    super(
      document.getElementById("prompt-textarea"),
      document.getElementById("composer-submit-button")
    );
  }
}
