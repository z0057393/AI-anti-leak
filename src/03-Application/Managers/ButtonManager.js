export default class ButtonManager {
  constructor() {}
  lock(button) {
    button.element.disabled = true;
    button.element.style.pointerEvents = "none";
    button.element.style.opacity = "0.5";
    button.isLocked = true;
  }

  unlock(button) {
    button.element.disabled = false;
    button.element.style.pointerEvents = "auto";
    button.element.style.opacity = "1";
    button.isLocked = false;
  }
}
