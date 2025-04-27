export default class HtmlManager {
  constructor(llmRepository) {
    this._llmRepository = llmRepository;
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
    this.styles = {};
  }

  createMirrorDiv(contentEditableElement) {
    const mirrorDiv = document.createElement("div");

    const computedStyle = window.getComputedStyle(contentEditableElement);

    for (const prop of this.STYLES_IMPORTANTS) {
      this.styles[prop] = computedStyle.getPropertyValue(prop);
    }
    this.applyStyles(mirrorDiv, this.styles, {
      position: "absolute",
      "z-index": "-1",
      pointerEvents: "none",
      "user-select": "none",
      top:
        (
          contentEditableElement.offsetTop -
          parseFloat(this.styles["margin-top"])
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

  updateMirrorText(elment) {
    const html = elment.innerHTML;

    const elRect = elment.getBoundingClientRect();
    const parentRect = elment.parentElement.getBoundingClientRect();

    const top =
      elRect.top -
      parentRect.top +
      (elment.offsetTop -
        parseFloat(this.styles["margin-top"]) -
        parseFloat(this.styles["margin-top"]));

    this.mirrorDiv.innerHTML = "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.body.style.backgroundColor = "transparent";
    this.applyStyles(this.mirrorDiv, {
      height: "auto",
      top: top.toString() + "px",
    });

    this.mirrorDiv.scrollTop = this.mirrorDiv.scrollHeight;
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
    if (this.enterKeyListener == null) return;
    document.removeEventListener("keydown", this.enterKeyListener, true);
    this.enterKeyListener = null;
  }
}
