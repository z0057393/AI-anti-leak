export default class Bare {
  constructor(promptHtml, buttonHtml) {
    this.promptHTML = promptHtml;
    this.buttonHTML = buttonHtml;
  }

  getPrompt() {
    return this.promptHTML;
  }

  getButton() {
    return this.buttonHTML;
  }
}
