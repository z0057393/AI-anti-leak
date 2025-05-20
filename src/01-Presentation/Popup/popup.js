import browser from "webextension-polyfill";

if (typeof browser !== "undefined" && browser.storage) {
  console.log("✅ Loaded");

  const addButton = document.getElementById("add-button");
  const addText = document.getElementById("add-text");
  const wordList = document.getElementById("word-list");

  const watchTab = document.getElementById("watch");
  const anonymiseTab = document.getElementById("anonymise");
  const sectionWords = document.querySelector(".section-words");
  const sectionTable = document.querySelector(".section-table");
  const tableBody = document.getElementById("table-body");
  const toggle = document.getElementById("toggle-extension");

  function afficherMots(mots) {
    wordList.innerHTML = "";

    mots.forEach((mot) => {
      const div = document.createElement("div");
      div.classList.add("word");
      div.textContent = mot;

      div.dataset.originalText = mot;
      div.dataset.state = "default";

      div.addEventListener("click", (e) => {
        e.stopPropagation();

        if (div.dataset.state === "active") {
          div.remove();

          browser.storage.local.get("motsInterdits").then((result) => {
            const anciensMots = result.motsInterdits || [];
            const nouveauxMots = anciensMots.filter(
              (m) => m !== div.dataset.originalText
            );
            browser.storage.local.set({ motsInterdits: nouveauxMots });
          });

          return;
        }

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

        tdModifiable.appendChild(input);
        row.appendChild(tdOriginal);
        row.appendChild(tdModifiable);
        tableBody.appendChild(row);
      });
    });
  }

  document.addEventListener("click", () => {
    resetWords();
  });

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

  // Initialisation du toggle (AIAL-State = extension active ou non)
  browser.storage.local.get("AIAL-State").then((result) => {
    const isEnabled = result["AIAL-State"] === true;
    toggle.checked = isEnabled;
  });

  // Toggle modifie AIAL-State
  toggle.addEventListener("change", () => {
    const newState = toggle.checked;
    browser.storage.local.set({ "AIAL-State": newState });
  });

  // Initialisation de l'onglet selon AIAL-IsAnonymisedMode
  browser.storage.local.get("AIAL-IsAnonymisedMode").then((result) => {
    const isAnonymised = result["AIAL-IsAnonymisedMode"] === true;

    toggle.checked = true; // ← Optionnel, à synchroniser selon AIAL-State si besoin

    if (isAnonymised) {
      anonymiseTab.classList.add("active");
      watchTab.classList.remove("active");
      sectionWords.style.display = "none";
      sectionTable.style.display = "block";
      chargerTableAnonymisation();
    } else {
      anonymiseTab.classList.remove("active");
      watchTab.classList.add("active");
      sectionWords.style.display = "block";
      sectionTable.style.display = "none";
    }
  });

  watchTab.addEventListener("click", () => {
    watchTab.classList.add("active");
    anonymiseTab.classList.remove("active");
    sectionWords.style.display = "block";
    sectionTable.style.display = "none";

    browser.storage.local.set({ "AIAL-IsAnonymisedMode": false });
  });

  anonymiseTab.addEventListener("click", () => {
    watchTab.classList.remove("active");
    anonymiseTab.classList.add("active");
    sectionWords.style.display = "none";
    sectionTable.style.display = "block";

    browser.storage.local.set({ "AIAL-IsAnonymisedMode": true });
    chargerTableAnonymisation();
  });
} else {
  console.error("❌ browser.storage est inaccessible");
}
