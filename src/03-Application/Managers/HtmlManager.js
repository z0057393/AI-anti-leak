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
      "visibility",
      "opacity",
      "overflow",
      "letter-spacing",
      "word-spacing",
      "font-kerning",
      "font-feature-settings",
      "font-variant",
      "text-rendering",
      "pointer-events",
    ];
    this.styles = {};
  }

  removeMirrorDiv() {
    console.log("MirrorDiv", this.mirrorDiv);
    if (this.mirrorDiv == null) return;
    if (this.mirrorDiv && this.mirrorDiv.parentElement) {
      this.mirrorDiv.parentElement.removeChild(this.mirrorDiv);
      this.mirrorDiv = null;
    }
  }

  createMirrorDiv(contentEditableElement) {
    const mirrorDiv = document.createElement("div");

    const computedStyle = window.getComputedStyle(contentEditableElement);

    for (const prop of this.STYLES_IMPORTANTS) {
      this.styles[prop] = computedStyle.getPropertyValue(prop);
    }
    this.applyStyles(mirrorDiv, this.styles, {
      position: "absolute",
      "pointer-events": "none",
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
    let html = elment.innerHTML;
    if (html === "") {
      html = elment.value;
    }
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
    console.log("anonymisedWords : ", anonymisedWords);
    const promptElement = llm.prompt;

    console.log("Value : ", promptElement.value);
    let text = "";

    if (promptElement.textContent) text = promptElement.textContent;
    if (promptElement.value) text = promptElement.value;

    if (!promptElement) {
      console.error("Élément prompt invalide :", promptElement);
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
