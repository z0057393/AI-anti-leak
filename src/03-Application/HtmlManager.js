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

  highlightWord(dictionnary, html) {
    this.mirrorDiv.innerHTML = "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        const words = node.textContent.split(/(\b)/);

        words.forEach((word) => {
          if (
            dictionnary.some(
              (target) => target.toLowerCase() === word.toLowerCase()
            )
          ) {
            const span = document.createElement("span");
            span.style.backgroundColor = "red";
            span.style.color = "white";
            span.textContent = word;
            frag.appendChild(span);
          } else {
            frag.appendChild(document.createTextNode(word));
          }
        });

        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };

    Array.from(tempDiv.childNodes).forEach(walk);

    this.mirrorDiv.appendChild(tempDiv);
  }

  updateMirrorText(html) {
    this.mirrorDiv.innerHTML = "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.body.style.backgroundColor = "transparent";

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
