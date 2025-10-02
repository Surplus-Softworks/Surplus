import { gameManager } from '@/state.js';
import { settings } from '@/state.js';
import { translatedTable } from '@/utils/obfuscatedNameTranslator.js';
import { reflect, ref_addEventListener, object } from '@/utils/hook.js';

export let isLayerSpoofActive = false;
export let originalLayerValue = null;

const TOGGLE_KEY = 'Space';

let originalLayerDescriptor = null;
let activePlayerRef = null;
let originalPlayerAlpha = 1;

const applyLayerSpoof = (player, targetLayer) => {
    if (!player || player.layer === undefined) return false;

    try {
        originalLayerDescriptor = object.getOwnPropertyDescriptor(player, 'layer');
        originalLayerValue = player.layer;

        if (!originalLayerDescriptor) {
            originalLayerDescriptor = { value: originalLayerValue, writable: true, enumerable: true, configurable: true };
        } else if (!originalLayerDescriptor.configurable) {
            originalLayerDescriptor = null;
            return false;
        }

        object.defineProperty(player, 'layer', {
            configurable: true,
            get: () => targetLayer,
            set: () => {},
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
            object.defineProperty(player, 'layer', originalLayerDescriptor);
            if ('value' in originalLayerDescriptor && !originalLayerDescriptor.get && !originalLayerDescriptor.set) {
                player.layer = originalLayerValue;
            }
        } else if (originalLayerValue !== null) {
            player.layer = originalLayerValue;
        }
    } catch {
        if (originalLayerValue !== null) {
            try {
                player.layer = originalLayerValue;
            } catch {}
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
    } catch {}
};

const cleanup = () => {
    try {
        if (activePlayerRef) {
            restoreOriginalLayer(activePlayerRef);
            setPlayerAlpha(activePlayerRef, originalPlayerAlpha);
        }
    } catch {}

    isLayerSpoofActive = false;
    activePlayerRef = null;
    originalPlayerAlpha = 1;
};

const handleKeyDown = (event) => {
    if (event.code !== TOGGLE_KEY || !settings.layerSpoof.enabled || isLayerSpoofActive) return;

    try {
        const player = gameManager.game?.[translatedTable.activePlayer];
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
    if (event.code !== TOGGLE_KEY || !isLayerSpoofActive) return;
    cleanup();
};

export default function() {
    reflect.apply(ref_addEventListener, globalThis, ['keydown', handleKeyDown]);
    reflect.apply(ref_addEventListener, globalThis, ['keyup', handleKeyUp]);
}
