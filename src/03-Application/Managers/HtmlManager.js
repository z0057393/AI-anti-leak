export default class HtmlManager {
  constructor(llmRepository) {
    this._llmRepository = llmRepository;
    this.isUpdating = false;
    this.enterKeyListener = null;
  }

  lockEnterKey() {
    if (this.enterKeyListener != null) return;
    this.enterKeyListener = function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener("keydown", this.enterKeyListener, true);
  }

  unlockEnterKey() {
    if (this.enterKeyListener == null) return;
    document.removeEventListener("keydown", this.enterKeyListener, true);
    this.enterKeyListener = null;
  }

  validate(llm) {
    const topBar = document.createElement("div");
    topBar.style.position = "absolute";
    topBar.style.top = "0";
    topBar.style.left = "0";
    topBar.style.width = "100%";
    topBar.style.height = "2px";
    topBar.style.backgroundColor = "green";
    topBar.style.zIndex = "9999";

    document.body.appendChild(topBar);
  }

  anonymise(llm, anonymisedWords) {
    const promptElement = llm.prompt;

    let text = "";

    if (promptElement.textContent) text = promptElement.textContent;
    if (promptElement.value) text = promptElement.value;

    if (!promptElement) {
      return;
    }

    const words = text.split(/(\b)/);

    const replaced = words
      .map((word) => {
        const key = Object.keys(anonymisedWords).find(
          (original) => original.toLowerCase() === word.toLowerCase()
        );
        return key ? anonymisedWords[key] : word;
      })
      .join("");

    if (promptElement.textContent) promptElement.textContent = replaced;
    if (promptElement.value) promptElement.value = replaced;

    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(promptElement);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
