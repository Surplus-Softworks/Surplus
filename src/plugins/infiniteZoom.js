import { gameManager } from "../utils/injector.js";
import { object, reflect } from "../utils/hook.js";
import { ref_addEventListener } from "../utils/hook.js";
import { settings } from "../loader.js";
import { obfuscatedNameTranslator } from '../utils/obfuscatedNameTranslator.js';

export default function infiniteZoom() {
  reflect.apply(ref_addEventListener, globalThis, ["wheel", (event) => {
    if (!event.shiftKey) return;
    if (!settings.infiniteZoom.enabled) return;
    try {
      let zoom = obfuscatedNameTranslator.activePlayer.localData.zoom;
      if (event.deltaY > 0) {
        zoom += 20;
      } else {
        zoom -= 30;
        zoom = Math.max(36, zoom)
      }
      object.defineProperty(obfuscatedNameTranslator.activePlayer.localData, "zoom", { configurable: true, get() { return zoom }, set() { } });
      event.stopImmediatePropagation();
    } catch {

    }
  }])
}