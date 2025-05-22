import Bare from "../Bare/Bare";

export default class deepseekManager extends Bare {
  constructor() {
    super(
      document.getElementById("chat-input"),
      document.querySelector('div[role="button"][class*="_7436101"]')
    );
  }
}
