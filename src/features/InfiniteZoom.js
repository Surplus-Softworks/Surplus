import { gameManager } from '@/core/state.js';
import { ref_addEventListener } from '@/core/hook.js';
import { settings } from '@/core/state.js';
import { translations } from '@/core/obfuscatedNameTranslator.js';
import { outer } from '@/core/outer';

const ZOOM_IN_STEP = 20;
const ZOOM_OUT_STEP = 30;
const MIN_ZOOM = 36;
const WHEEL_OPTIONS = { capture: true, passive: false };

const handleWheelEvent = (event) => {
  if (!event.shiftKey || !settings.infiniteZoom_.enabled_) return;

  try {
    const game = gameManager.game;
    const activePlayer = game[translations.activePlayer_];
    const localData = activePlayer[translations.localData_];
    let zoom = localData[translations.zoom_];

    zoom += event.deltaY > 0 ? ZOOM_IN_STEP : -ZOOM_OUT_STEP;
    zoom = Math.max(MIN_ZOOM, zoom);

    Object.defineProperty(localData, translations.zoom_, {
      configurable: true,
      get: () => zoom,
      set: () => { },
    });

    event.preventDefault();
    event.stopImmediatePropagation();
  } catch { }
};

export default function () {
  Reflect.apply(ref_addEventListener, outer, ['wheel', handleWheelEvent, WHEEL_OPTIONS]);
}
