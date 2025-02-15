import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";

export default function infiniteZoom() {
  window.addEventListener('wheel', function (event) {
    if (!event.shiftKey) return;
    try {
      let zoom = gameManager.game.activePlayer.localData.zoom;
      if (event.deltaY > 0) {
        zoom += 35;
      } else {
        zoom -= 35;
        zoom = Math.max(36, zoom)
      }
      object.defineProperty(gameManager.game.activePlayer.localData, "zoom", { configurable: true, get() { return zoom }, set() { } });
      event.stopImmediatePropagation();
    } catch {

    }
  }, false);
}