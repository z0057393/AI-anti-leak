import Bare from "../Bare/Bare";

export default class ClaudeManager extends Bare {
  constructor() {
    super(
      document.querySelector('.ProseMirror[contenteditable="true"]'),
      document.querySelector('button[aria-label="Envoyer le message"]')
    );
  }
}
