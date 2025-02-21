import { gameManager } from "../utils/injector.js";
import { object, reflect } from "../utils/hook.js";
import { validate } from "../utils/security.js";
import { ref_addEventListener } from "../utils/hook.js";

export default function infiniteZoom() {
  validate(Date.now, true);
  reflect.apply(ref_addEventListener, globalThis, ["wheel", (event)=>{
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
  }])
}