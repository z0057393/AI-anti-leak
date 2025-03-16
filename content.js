const prompt = document.getElementById("prompt-textarea");

const dictionnary = ["interdit", "danger", "bloqué", "censuré"];

if (prompt) {
  function observerCallback(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const promptText = mutation.target.textContent;

        // Vérifier s'il y a un match avec les mots de la liste
        const isMatch = dictionnary.some((word) => {
          const regex = new RegExp("\\b" + word + "\\b", "i"); // Crée une regex avec les délimiteurs de mots (\b) pour une recherche précise
          return regex.test(promptText);
        });

        // Sélectionner l'élément avec l'attribut data-testid
        const sendButton = document.querySelector(
          '[data-testid="send-button"]'
        );

        if (sendButton) {
          if (isMatch) {
            console.log("✅ Match trouvé !");
            // Désactiver l'élément
            sendButton.disabled = true;
            sendButton.style.pointerEvents = "none"; // Désactiver les interactions
            sendButton.style.opacity = "0.5"; // Rendre visuellement désactivé
          } else {
            console.log("❌ Pas de match !");
            // Réactiver l'élément
            sendButton.disabled = false;
            sendButton.style.pointerEvents = "auto"; // Réactiver les interactions
            sendButton.style.opacity = "1"; // Remettre l'opacité
          }
        } else {
          console.log("Élément introuvable.");
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

  console.log("Observation des changements du prompt démarrée !");
} else {
  console.log("Aucun prompt trouvé");
}
