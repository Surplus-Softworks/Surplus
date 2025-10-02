import { gameManager } from '@/state.js';
import { object, reflect, ref_addEventListener } from '@/utils/hook.js';
import { settings } from '@/state.js';
import { translations } from '@/utils/obfuscatedNameTranslator.js';

const ZOOM_IN_STEP = 20;
const ZOOM_OUT_STEP = 30;
const MIN_ZOOM = 36;
const WHEEL_OPTIONS = { capture: true, passive: false };

const handleWheelEvent = (event) => {
  if (!event.shiftKey || !settings.infiniteZoom_.enabled_) return;

  try {
    const game = gameManager.game;
    const activePlayer = game[translations.activePlayer];
    const localData = activePlayer[translations.localData];
    let zoom = localData[translations.zoom];

    zoom += event.deltaY > 0 ? ZOOM_IN_STEP : -ZOOM_OUT_STEP;
    zoom = Math.max(MIN_ZOOM, zoom);

    object.defineProperty(localData, translations.zoom, {
      configurable: true,
      get: () => zoom,
      set: () => {},
    });

    event.preventDefault();
    event.stopImmediatePropagation();
  } catch {}
};

export default function() {
  reflect.apply(ref_addEventListener, globalThis, ['wheel', handleWheelEvent, WHEEL_OPTIONS]);
}
