import aiFactory from "../02-Infrastructure/Factory/AIFactory";

export default class HtmlManager {
  constructor() {
    this.aiFactory = new aiFactory();
    this.isUpdating = false;
    this.mirrorDiv = null;
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
    // Création de la div miroir
    const mirrorDiv = document.createElement("div");

    // Positionnement absolu pour que la div miroir soit positionnée exactement comme le contentEditable
    mirrorDiv.style.position = "absolute";
    mirrorDiv.style.top = contentEditableElement.offsetTop + "px"; // Position verticale
    mirrorDiv.style.left = contentEditableElement.offsetLeft + "px"; // Position horizontale
    mirrorDiv.style.zIndex = "10"; // Au-dessus de l'élément contentEditable
    mirrorDiv.style.pointerEvents = "none"; // Ne pas interagir avec la div miroir
    mirrorDiv.style.whiteSpace = "pre-wrap"; // S'assurer que le texte se comporte comme dans contentEditable

    // Réplique des propriétés de la police
    const computedStyles = window.getComputedStyle(contentEditableElement);
    mirrorDiv.style.fontFamily = computedStyles.fontFamily;
    mirrorDiv.style.fontSize = computedStyles.fontSize;
    mirrorDiv.style.lineHeight = computedStyles.lineHeight;
    mirrorDiv.style.fontWeight = computedStyles.fontWeight;
    mirrorDiv.style.fontStyle = computedStyles.fontStyle;
    mirrorDiv.style.textTransform = computedStyles.textTransform; // Si le texte est transformé en majuscules/minuscules
    mirrorDiv.style.letterSpacing = computedStyles.letterSpacing; // Espacement des lettres
    mirrorDiv.style.wordSpacing = computedStyles.wordSpacing; // Espacement des mots

    // Réplique des autres styles de mise en page (padding, margin, etc.)
    mirrorDiv.style.padding = computedStyles.padding;
    mirrorDiv.style.margin = computedStyles.margin;
    mirrorDiv.style.width = contentEditableElement.offsetWidth + "px"; // Largeur identique à contentEditable
    mirrorDiv.style.height = contentEditableElement.offsetHeight + "px"; // Hauteur identique à contentEditable
    mirrorDiv.style.overflow = "hidden"; // Pour éviter le débordement de texte

    // Ajout de la div miroir au DOM
    contentEditableElement.parentElement.appendChild(mirrorDiv);

    // Sauvegarder la référence à la div miroir dans l'objet
    this.mirrorDiv = mirrorDiv;

    // Mise à jour des dimensions et position en cas de redimensionnement du contentEditable
    this.updateMirrorDivPosition(contentEditableElement);
  }

  updateMirrorDivPosition(contentEditableElement) {
    // Mise à jour de la position et des dimensions de la div miroir si contentEditable est déplacé ou redimensionné
    console.log(contentEditableElement.offsetTop);
    console.log(contentEditableElement.offsetTop);
    this.mirrorDiv.style.top = contentEditableElement.offsetTop - 8 + "px";
    this.mirrorDiv.style.left = contentEditableElement.offsetLeft + "px";
    this.mirrorDiv.style.width = contentEditableElement.offsetWidth + "px";
    this.mirrorDiv.style.height = contentEditableElement.offsetHeight + "px";
  }

  HighlightWord(dictionnary, rootElement) {
    // Vérification si rootElement est un élément valide
    if (!(rootElement instanceof HTMLElement)) {
      return;
    }

    // Fonction de mise à jour du contenu de la div miroir
    const updateMirror = () => {
      let html = rootElement.innerText;

      // Surbrillance des mots dans le texte
      dictionnary.forEach((word) => {
        const regex = new RegExp(`\\b(${word})\\b`, "gi");
        html = html.replace(
          regex,
          `<span style="background-color:red; color: white;">$1</span>`
        );
      });

      this.mirrorDiv.innerHTML = html;
    };

    // Mise à jour initiale du miroir
    updateMirror();

    // Écoute des événements qui modifient le contenu
    rootElement.addEventListener("input", updateMirror);
    rootElement.addEventListener("keydown", updateMirror);
    rootElement.addEventListener("keyup", updateMirror);
  }

  updateMirrorText(html) {
    this.mirrorDiv.innerHTML = html;
  }
}
