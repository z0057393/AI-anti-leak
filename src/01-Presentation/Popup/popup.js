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
    console.log(" mot ", mots);

    mots.forEach((mot) => {
      console.log("afficher mot ");

      const div = document.createElement("div");
      console.log("afficher mot ");

      div.classList.add("word");
      console.log("afficher mot ");

      div.textContent = mot;
      console.log("afficher mot ");

      wordList.appendChild(div);
    });
  }

  browser.storage.local.get("motsInterdits").then((result) => {
    const mots = result.motsInterdits || [];

    afficherMots(mots);
  });

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
