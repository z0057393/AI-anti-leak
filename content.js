const prompt = document.getElementById("prompt-textarea");

if (prompt) {
  function observerCallback(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        console.log("Texte mis à jour :", mutation.target.textContent);
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
