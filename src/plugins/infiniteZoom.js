import { gameManager } from "../utils/injector.js";
import { object, reflect, ref_addEventListener } from "../utils/hook.js";
import { settings } from "../loader.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';

export default function() {
  const handleWheelEvent = (event) => {
    if (!event.shiftKey || !settings.infiniteZoom.enabled) return;
    
    try {
      const activePlayer = gameManager.game[tr.activePlayer];
      const localData = activePlayer[tr.localData];
      let zoom = localData[tr.zoom];

      if (event.deltaY > 0) {
        zoom += 20;
      } else {
        zoom -= 30; 
        zoom = Math.max(36, zoom); 
      }

      object.defineProperty(localData, tr.zoom, {
        configurable: true,
        get: () => zoom,
        set: () => {} 
      });

      event.preventDefault();
      event.stopImmediatePropagation();
    } catch { }
  };

  reflect.apply(ref_addEventListener, globalThis, [
    "wheel",
    handleWheelEvent,
    true 
  ]);
}