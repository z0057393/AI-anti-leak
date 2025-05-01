import Bare from "../Bare/Bare";

export default class MistralManager extends Bare {
  constructor() {
    super(
      document.querySelector(
        'textarea[placeholder="Demander au Chat ou @mentionner un agent"]'
      ),
      document.querySelector('button[aria-label="Send question"]')
    );
  }
}
