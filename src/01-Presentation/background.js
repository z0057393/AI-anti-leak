console.log("background loaded....");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Test from bg ");
  if (msg.action === "sendText") {
    (async () => {
      try {
        const res = await fetch("http://localhost:5024/prompt/save-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: msg.prompt }),
        });
        console.log(res);
        const data = await res.json();
        console.log(res);
        sendResponse({ text: data.json.text });
      } catch (err) {
        sendResponse({ text: "Erreur: " + err.message });
      }
    })();
    return true;
  }
});
