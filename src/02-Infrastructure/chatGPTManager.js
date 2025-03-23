export default class ChatGPTManager {
  constructor() {
    this.promptHTML = document.getElementById("prompt-textarea");
    this.buttonHTML = document.querySelector('[data-testid="send-button"]');
  }

  getPrompt() {
    return this.promptHTML;
  }

  getButton() {
    return this.buttonHTML;
  }

  lockButton() {
    console.log("✅ Match trouvé !");
    this.buttonHTML.disabled = true;
    this.buttonHTML.style.pointerEvents = "none";
    this.buttonHTML.style.opacity = "0.5";
  }

  unlockButton() {
    console.log("❌ Pas de match !");
    this.buttonHTML.disabled = false;
    this.buttonHTML.style.pointerEvents = "auto";
    this.buttonHTML.style.opacity = "1";
  }
}
