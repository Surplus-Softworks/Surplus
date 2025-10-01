import { gameManager } from '@/utils/injector.js';
import { object, reflect, ref_addEventListener } from '@/utils/hook.js';
import { settings } from '@/state.js';
import { tr } from '@/utils/obfuscatedNameTranslator.js';

const ZOOM_IN_STEP = 20;
const ZOOM_OUT_STEP = 30;
const MIN_ZOOM = 36;
const WHEEL_OPTIONS = { capture: true, passive: false };

const handleWheelEvent = (event) => {
  if (!event.shiftKey || !settings.infiniteZoom.enabled) return;

  try {
    const game = gameManager.game;
    const activePlayer = game[tr.activePlayer];
    const localData = activePlayer[tr.localData];
    let zoom = localData[tr.zoom];

    zoom += event.deltaY > 0 ? ZOOM_IN_STEP : -ZOOM_OUT_STEP;
    zoom = Math.max(MIN_ZOOM, zoom);

    object.defineProperty(localData, tr.zoom, {
      configurable: true,
      get: () => zoom,
      set: () => {},
    });

    event.preventDefault();
    event.stopImmediatePropagation();
  } catch {}
};

export default function initInfiniteZoom() {
  reflect.apply(ref_addEventListener, globalThis, ['wheel', handleWheelEvent, WHEEL_OPTIONS]);
}
