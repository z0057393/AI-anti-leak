const prompt = document.getElementById("prompt-textarea");

const regex = /test/i; // Remplace "monPattern" par ton expression régulière

if (prompt) {
  function observerCallback(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        console.log("Texte mis à jour :", mutation.target.textContent);
        const texte = mutation.target.textContent;

        if (regex.test(texte)) {
          console.log("✅ Match trouvé :", texte);

          // Sélectionner l'élément avec l'attribut data-testid
          const element = document.querySelector('[data-testid="send-button"]');

          if (element) {
            element.disabled = true; // Désactiver l'élément
            element.style.pointerEvents = "none"; // Désactiver les interactions
            element.style.opacity = "0.5"; // Rendre visuellement désactivé
            console.log("Élément désactivé !");
          } else {
            console.log("Élément introuvable.");
          }
        } else {
          console.log("❌ Pas de match :", texte);
        }
      }
    });
  }

  const observer = new MutationObserver(observerCallback);

  observer.observe(prompt, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  console.log("Observation des changements du prompt démarré  !");
} else {
  console.log("Aucun prompt trouvé ");
}
