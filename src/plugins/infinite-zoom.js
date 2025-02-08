import { gameManager } from "../injector/injector.js";
import { object } from "../injector/hook.js";

export function infiniteZoom() {
  window.addEventListener('wheel', function (event) {
    if (!event.shiftKey) return;
    try {
      let zoom = gameManager.game.activePlayer.localData.zoom;
      if (event.deltaY > 0) {
        zoom += 15;
      } else {
        zoom -= 15;
        zoom = Math.max(30, zoom)
      }
      object.defineProperty(gameManager.game.activePlayer.localData, "zoom", { configurable: true, get() { return zoom }, set() { } });
      event.stopImmediatePropagation();
    } catch { }

  }, false);
}