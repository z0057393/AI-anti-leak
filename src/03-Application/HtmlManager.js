import aiFactory from "../02-Infrastructure/Factory/AIFactory";

export default class HtmlManager {
  constructor() {
    this.aiFactory = new aiFactory();
    this.isUpdating = false;
    this.mirrorDiv = null;
    this.enterKeyListener = null;
    this.STYLES_IMPORTANTS = [
      "position",
      "top",
      "left",
      "right",
      "bottom",
      "width",
      "height",
      "margin",
      "margin-top",
      "padding",
      "display",
      "color",
      "font-size",
      "font-family",
      "font-weight",
      "line-height",
      "text-align",
      "border",
      "border-radius",
      "box-shadow",
      "background",
      "background-color",
      "z-index",
      "visibility",
      "opacity",
      "overflow",
      "letter-spacing",
      "word-spacing",
      "font-kerning",
      "font-feature-settings",
      "font-variant",
      "text-rendering",
    ];
  }

  getPrompt() {
    return this.aiFactory.getPrompt();
  }

  getButton() {
    return this.aiFactory.getButton();
  }

  lockButton() {
    this.aiFactory.lockButton();
  }

  unlockButton() {
    this.aiFactory.unlockButton();
  }

  async waitForPrompt(timeout = 10000, intervalTime = 300) {
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const prompt = this.getPrompt();

        if (prompt instanceof Node) {
          clearInterval(interval);
          resolve(prompt);
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(new Error("Prompt introuvable après timeout"));
        }
      }, intervalTime);
    });
  }

  createMirrorDiv(contentEditableElement) {
    const mirrorDiv = document.createElement("div");

    const styles = {};
    const computedStyle = window.getComputedStyle(contentEditableElement);

    for (const prop of this.STYLES_IMPORTANTS) {
      styles[prop] = computedStyle.getPropertyValue(prop);
    }
    this.applyStyles(mirrorDiv, styles, {
      position: "absolute",
      "z-index": "10",
      pointerEvents: "none",
      "user-select": "none",
      top:
        (
          contentEditableElement.offsetTop - parseFloat(styles["margin-top"])
        ).toString() + "px",
    });
    contentEditableElement.parentElement.appendChild(mirrorDiv);

    this.mirrorDiv = mirrorDiv;
  }

  applyStyles(element, styles, override = {}) {
    for (const [prop, value] of Object.entries(styles)) {
      const finalValue = override[prop] ?? value;
      element.style.setProperty(prop, finalValue);
    }
  }

  highlightWord(dictionnary, rootElement) {
    // if (!(rootElement instanceof HTMLElement)) return;

    // let html = rootElement.innerText;
    // dictionnary.forEach((word) => {
    //   const regex = new RegExp(`\\b(${word})\\b`, "gi");
    //   html = html.replace(
    //     regex,
    //     `<span style="background-color:red; color: white;">$1</span>`
    //   );
    // });
    // this.mirrorDiv.innerHTML = html;

    if (!(rootElement instanceof HTMLElement)) return;

    const text = rootElement.innerText;
    const words = text.split(/\b/); // découpe par mots
    this.mirrorDiv.innerHTML = ""; // vide le container

    words.forEach((part) => {
      const span = document.createElement("span");
      if (
        dictionnary.some((word) => word.toLowerCase() === part.toLowerCase())
      ) {
        span.style.backgroundColor = "red";
        span.style.color = "white";
      }
      span.textContent = part;
      this.mirrorDiv.appendChild(span);
    });
  }

  updateMirrorText(html) {
    this.mirrorDiv.innerHTML = "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.body.style.backgroundColor = "transparent"; // ou une couleur spécifique si tu veux

    this.mirrorDiv.appendChild(doc.body);
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
    if (this.enterKeyListener != null) {
      document.removeEventListener("keydown", this.enterKeyListener, true);
      this.enterKeyListener = null;
    }
  }
}
