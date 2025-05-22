import Bare from "../Bare/Bare";

export default class geminiManager extends Bare {
  constructor() {
    super(
      document.querySelector(".ql-editor.textarea.new-input-ui"),
      document.getElementsByClassName("send-button")
    );
  }
}
