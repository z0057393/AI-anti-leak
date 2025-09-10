import browser from "webextension-polyfill";

if (typeof browser !== "undefined" && browser.storage) {
  console.log("✅ Loaded");

  const addButton = document.getElementById("add-button");
  const addText = document.getElementById("add-text");
  const tableBody = document.getElementById("table-body");

  function chargerTableAnonymisation() {
    tableBody.innerHTML = "";

    Promise.all([
      browser.storage.local.get("motsInterdits"),
      browser.storage.local.get("AIAL-AnonymisedWords"),
    ]).then(([resultMots, resultAnonymised]) => {
      const motsOriginaux = resultMots.motsInterdits || [];
      const motsAnonymised =
        resultAnonymised["AIAL-AnonymisedWords"]?.anonymised || {};

      const mots = motsOriginaux.map((mot) => ({
        original: mot,
        modifiable: motsAnonymised[mot] || "",
      }));

      mots.forEach((mot, index) => {
        const row = document.createElement("tr");

        const tdOriginal = document.createElement("td");
        tdOriginal.textContent = mot.original;

        const tdModifiable = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.value = mot.modifiable;

        input.addEventListener("input", (e) => {
          const nouvelleValeur = e.target.value;
          mots[index].modifiable = nouvelleValeur;

          browser.storage.local.get("AIAL-AnonymisedWords").then((result) => {
            const base = result["AIAL-AnonymisedWords"] || {};
            const data = base.anonymised || {};

            data[mot.original] = nouvelleValeur;

            browser.storage.local
              .set({
                "AIAL-AnonymisedWords": { anonymised: data },
              })
              .then(() => {
                console.log(
                  `💾 Sauvegardé : ${mot.original} -> ${nouvelleValeur}`
                );
              });
          });
        });

        // Add delete button
        const tdDelete = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.addEventListener("click", () => {
          browser.storage.local.get("motsInterdits").then((result) => {
            const anciensMots = result.motsInterdits || [];
            const nouveauxMots = anciensMots.filter((m) => m !== mot.original);
            browser.storage.local
              .set({ motsInterdits: nouveauxMots })
              .then(() => {
                chargerTableAnonymisation(); // Reload the table
              });
          });
        });

        tdModifiable.appendChild(input);
        tdDelete.appendChild(deleteBtn);
        row.appendChild(tdOriginal);
        row.appendChild(tdModifiable);
        row.appendChild(tdDelete);
        tableBody.appendChild(row);
      });
    });
  }

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
              chargerTableAnonymisation();
              addText.value = "";
            });
        });
      } else {
        console.warn("⛔ Aucun mot saisi !");
      }
    });
  }

  // Load the anonymisation table on startup
  chargerTableAnonymisation();
} else {
  console.error("❌ browser.storage est inaccessible");
}
