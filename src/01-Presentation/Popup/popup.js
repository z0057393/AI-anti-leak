if (typeof browser !== "undefined" && browser.storage) {
  console.log("✅ Loaded");
  const addButton = document.getElementById("add");
  const inputMot = document.getElementById("inputMot");
  const listeMots = document.getElementById("listeMots");

  // Fonction pour afficher les mots
  function afficherMots(mots) {
    listeMots.innerHTML = ""; // clear
    mots.forEach((mot) => {
      const li = document.createElement("li");
      li.textContent = mot;
      listeMots.appendChild(li);
    });
  }

  // Charger les mots au démarrage de la popup
  browser.storage.local.get("motsInterdits").then((result) => {
    const mots = result.motsInterdits || [];
    afficherMots(mots);
  });

  if (addButton && inputMot) {
    console.log("✅ Vars init");
    addButton.addEventListener("click", () => {
      const mot = inputMot.value.trim();

      if (mot) {
        console.log("🔤 Mot saisi :", mot);

        // Exemple : ajouter à un tableau existant dans le storage
        browser.storage.local.get("motsInterdits").then((result) => {
          const anciensMots = result.motsInterdits || [];
          const nouveauxMots = [...anciensMots, mot];

          browser.storage.local
            .set({ motsInterdits: nouveauxMots })
            .then(() => {
              console.log("✅ Mot ajouté :", mot);
              afficherMots(nouveauxMots);
              inputMot.value = ""; // reset input
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
