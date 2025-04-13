// popup.js
import browser from "webextension-polyfill";

if (!browser.runtime) {
  console.error("webextension-polyfill ne fonctionne pas ici");
}

console.log("✅ Script exécuté depuis fichier externe !");

browser.storage.local.set({ motsInterdits: ["test"] });

browser.storage.local.get("motsInterdits").then((result) => {
  console.log("Mots récupérés :", result.motsInterdits);
});
