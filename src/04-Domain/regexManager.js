export default class RegexManager {
  constructor() {}

  CheckPrompt(dictionnary, inputPrompt) {
    return dictionnary.some((word) => {
      const regex = new RegExp("\\b" + word + "\\b", "i");
      return regex.test(inputPrompt);
    });
  }
}
