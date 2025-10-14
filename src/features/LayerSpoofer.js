import { gameManager } from '@/core/state.js';
import { settings } from '@/core/state.js';
import { translations } from '@/core/obfuscatedNameTranslator.js';
import { ref_addEventListener } from '@/core/hook.js';
import { outer } from '@/core/outer.js';

export let isLayerSpoofActive = false;
export let originalLayerValue = null;

let originalLayerDescriptor = null;
let activePlayerRef = null;
let originalPlayerAlpha = 1;

const applyLayerSpoof = (player, targetLayer) => {
  if (!player || player.layer === undefined) return false;

  try {
    originalLayerDescriptor = Object.getOwnPropertyDescriptor(player, 'layer');
    originalLayerValue = player.layer;

    if (!originalLayerDescriptor) {
      originalLayerDescriptor = {
        value: originalLayerValue,
        writable: true,
        enumerable: true,
        configurable: true,
      };
    } else if (!originalLayerDescriptor.configurable) {
      originalLayerDescriptor = null;
      return false;
    }

    Object.defineProperty(player, 'layer', {
      configurable: true,
      get: () => targetLayer,
      set: () => { },
    });
    return true;
  } catch {
    originalLayerDescriptor = null;
    originalLayerValue = null;
    return false;
  }
};

const restoreOriginalLayer = (player) => {
  if (!player) return;

  try {
    if (originalLayerDescriptor) {
      Object.defineProperty(player, 'layer', originalLayerDescriptor);
      if (
        'value' in originalLayerDescriptor &&
        !originalLayerDescriptor.get &&
        !originalLayerDescriptor.set
      ) {
        player.layer = originalLayerValue;
      }
    } else if (originalLayerValue !== null) {
      player.layer = originalLayerValue;
    }
  } catch {
    if (originalLayerValue !== null) {
      try {
        player.layer = originalLayerValue;
      } catch { }
    }
  } finally {
    originalLayerDescriptor = null;
    originalLayerValue = null;
  }
};

const setPlayerAlpha = (player, alpha) => {
  if (!player?.container) return;
  try {
    player.container.alpha = alpha;
  } catch { }
};

const cleanup = () => {
  try {
    if (activePlayerRef) {
      restoreOriginalLayer(activePlayerRef);
      setPlayerAlpha(activePlayerRef, originalPlayerAlpha);
    }
  } catch { }

  isLayerSpoofActive = false;
  activePlayerRef = null;
  originalPlayerAlpha = 1;
};

const handleKeyDown = (event) => {
  if (
    event.code !== settings.keybinds_.toggleLayerSpoof_ ||
    !settings.layerSpoof_.enabled_ ||
    isLayerSpoofActive
  )
    return;

  try {
    const player = gameManager.game?.[translations.activePlayer_];
    if (!player || player.layer === undefined || !player.container) return;

    activePlayerRef = player;
    originalPlayerAlpha = player.container.alpha;

    const targetLayer = player.layer === 0 ? 1 : 0;
    if (applyLayerSpoof(player, targetLayer)) {
      isLayerSpoofActive = true;
      setPlayerAlpha(player, 0.5);
    } else {
      activePlayerRef = null;
    }
  } catch {
    cleanup();
  }
};

const handleKeyUp = (event) => {
  if (event.code !== settings.keybinds_.toggleLayerSpoof_ || !isLayerSpoofActive) return;
  cleanup();
};

export default function () {
  Reflect.apply(ref_addEventListener, outer, ['keydown', handleKeyDown]);
  Reflect.apply(ref_addEventListener, outer, ['keyup', handleKeyUp]);
}
