import browser from "webextension-polyfill";
import IApiRepository from "../../03-Application/Interface/IApiRepository";

export default class ApiRepository extends IApiRepository {
  constructor() {
    super();
  }

  send(llm) {
    const prompt = llm.prompt?.textContent;
    if (!prompt) return;

    chrome.runtime.sendMessage(
      { action: "sendText", prompt },
      (response) => {}
    );
  }
}
