import browser from "webextension-polyfill";

if (typeof browser !== "undefined" && browser.storage) {
  console.log("✅ Loaded");
  const addButton = document.getElementById("add");
  const removeButton = document.getElementById("remove");
  const inputMot = document.getElementById("inputMot");
  const listeMots = document.getElementById("listeMots");

  function afficherMots(mots) {
    listeMots.innerHTML = "";
    mots.forEach((mot) => {
      const li = document.createElement("li");
      li.textContent = mot;
      listeMots.appendChild(li);
    });
  }

  browser.storage.local.get("motsInterdits").then((result) => {
    const mots = result.motsInterdits || [];
    afficherMots(mots);
  });

  if (addButton && inputMot) {
    addButton.addEventListener("click", () => {
      const mot = inputMot.value.trim();

      if (mot) {
        browser.storage.local.get("motsInterdits").then((result) => {
          const anciensMots = result.motsInterdits || [];
          const nouveauxMots = [...anciensMots, mot];

          browser.storage.local
            .set({ motsInterdits: nouveauxMots })
            .then(() => {
              afficherMots(nouveauxMots);
              inputMot.value = "";
            });
        });
      } else {
        console.warn("⛔ Aucun mot saisi !");
      }
    });
  }

  if (removeButton && inputMot) {
    removeButton.addEventListener("click", () => {
      const mot = inputMot.value.trim();

      if (mot) {
        browser.storage.local.get("motsInterdits").then((result) => {
          const anciensMots = result.motsInterdits || [];
          const nouveauxMots = anciensMots.filter((m) => m !== mot);

          browser.storage.local
            .set({ motsInterdits: nouveauxMots })
            .then(() => {
              afficherMots(nouveauxMots);
              inputMot.value = "";
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
