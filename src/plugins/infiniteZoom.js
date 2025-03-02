import { gameManager } from "../utils/injector.js";
import { object, reflect } from "../utils/hook.js";
import { ref_addEventListener } from "../utils/hook.js";
import { settings } from "../loader.js";
import { translator } from '../utils/obfuscatedNameTranslator.js';

export default function infiniteZoom() {
  reflect.apply(ref_addEventListener, globalThis, ["wheel", (event) => {
    if (!event.shiftKey) return;
    if (!settings.infiniteZoom.enabled) return;
    try {
      let zoom = gameManager.game[translator.activePlayer][translator.localData][translator.zoom];
      if (event.deltaY > 0) {
        zoom += 20;
      } else {
        zoom -= 30;
        zoom = Math.max(36, zoom)
      }
      object.defineProperty(gameManager.game[translator.activePlayer][translator.localData], translator.zoom, {
        configurable: true,
        get() { return zoom },
        set() { }
      });
      event.stopImmediatePropagation();
    } catch {

    }
  }])
}