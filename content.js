const prompt = document.getElementById("prompt-textarea");

const dictionnary = ["interdit", "danger", "bloqué", "censuré"];

if (prompt) {
  function observerCallback(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const promptText = mutation.target.textContent;

        const isMatch = dictionnary.some((word) => {
          const regex = new RegExp("\\b" + word + "\\b", "i");
          return regex.test(promptText);
        });

        const sendButton = document.querySelector(
          '[data-testid="send-button"]'
        );

        if (sendButton) {
          if (isMatch) {
            sendButton.disabled = true;
            sendButton.style.pointerEvents = "none";
            sendButton.style.opacity = "0.5";
          } else {
            sendButton.disabled = false;
            sendButton.style.pointerEvents = "auto";
            sendButton.style.opacity = "1";
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
