if (typeof browser !== "undefined" && browser.storage) {
  console.log("✅ Accès à browser.storage OK");

  browser.storage.local.set({ motsInterdits: ["test"] });

  browser.storage.local.get("motsInterdits").then((result) => {
    console.log("Mots récupérés :", result.motsInterdits);
  });
} else {
  console.error("❌ browser.storage est inaccessible");
}
