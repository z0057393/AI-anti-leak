import browser from "webextension-polyfill";

if (typeof browser !== "undefined" && browser.storage) {
  console.log("✅ Loaded");

  const addButton = document.getElementById("add-button");
  const addText = document.getElementById("add-text");
  const wordList = document.getElementById("word-list");

  console.log(addButton);
  console.log(addText);

  function afficherMots(mots) {
    console.log("wordlist", wordList);
    wordList.innerHTML = "";

    mots.forEach((mot) => {
      const div = document.createElement("div");
      div.classList.add("word");
      div.textContent = mot;

      // Sauvegarde le texte original et l'état
      div.dataset.originalText = mot;
      div.dataset.state = "default";

      // Écouteur pour chaque mot
      div.addEventListener("click", (e) => {
        e.stopPropagation();

        if (div.dataset.state === "active") {
          // Supprimer du DOM
          div.remove();

          // Supprimer du storage
          browser.storage.local.get("motsInterdits").then((result) => {
            const anciensMots = result.motsInterdits || [];
            const nouveauxMots = anciensMots.filter(
              (m) => m !== div.dataset.originalText
            );
            browser.storage.local.set({ motsInterdits: nouveauxMots });
          });

          return;
        }

        // Sinon, activer l’état rouge/poubelle
        resetWords();
        div.style.backgroundColor = "red";
        div.textContent = "🗑️";
        div.dataset.state = "active";
      });

      wordList.appendChild(div);
    });
  }

  function resetWords() {
    document.querySelectorAll(".word").forEach((word) => {
      if (word.dataset.originalText) {
        word.style.backgroundColor = "";
        word.textContent = word.dataset.originalText;
        word.dataset.state = "default";
      }
    });
  }

  // Réinitialiser au clic en dehors
  document.addEventListener("click", () => {
    resetWords();
  });

  // Charger les mots au démarrage
  browser.storage.local.get("motsInterdits").then((result) => {
    const mots = result.motsInterdits || [];
    afficherMots(mots);
  });

  // Ajouter un mot
  if (addButton && addText) {
    addButton.addEventListener("click", () => {
      const mot = addText.value.trim();

      if (mot) {
        browser.storage.local.get("motsInterdits").then((result) => {
          const anciensMots = result.motsInterdits || [];
          const nouveauxMots = [...anciensMots, mot];

          browser.storage.local
            .set({ motsInterdits: nouveauxMots })
            .then(() => {
              afficherMots(nouveauxMots);
              addText.value = "";
            });
        });
      } else {
        console.warn("⛔ Aucun mot saisi !");
      }
    });
  }
} else {
  console.error("❌ browser.storage est inaccessible");
}
